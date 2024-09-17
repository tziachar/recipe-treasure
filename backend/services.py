import logging
from sqlite3 import IntegrityError
from typing import List
import unicodedata
from sqlalchemy.orm import Session
from fastapi import HTTPException
import json
import bcrypt
from models import User, Ingredient, Recipe, ProcessedIngredient, ProcessedIngredientRecipe, IngredientRecipe
from schemas import UserCreate, IngredientCreate, RecipeCreate, ProcessedIngredientCreate, IngredientOut, UserOut, Description
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv
import os
from pathlib import Path

dotenv_path = Path('./secret.env')
load_dotenv(dotenv_path=dotenv_path)
admin_username = os.getenv("ADMIN_USERNAME")
admin_password = os.getenv("ADMIN_PASSWORD")
admin_email=os.getenv("ADMIN_EMAIL")

def authenticate_user(db: Session, username: str, password: str):
    # Check if user is admin, update is_admin to True
    if username == admin_username and password == admin_password:

        db_user = db.query(User).filter(User.email == admin_email).first()

        if db_user:
            db_user.is_admin = True
            db.commit()
            db.refresh(db_user)
            return db_user, True  
        else:
            return None, False
    # The rest of users authentication
    user = db.query(User).filter(User.username == username).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
        return user, user.is_admin
    return None, False


def create_user(db: Session, user: UserCreate):
    # Check if email already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if password already exists
    users_with_same_password = db.query(User).all()
    for existing_user in users_with_same_password:
        if bcrypt.checkpw(user.password.encode('utf-8'), existing_user.hashed_password.encode('utf-8')):
            raise HTTPException(status_code=400, detail="Password already in use")

    # Hash the new user's password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    # Create the new user
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password.decode('utf-8'))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    # Get all users from DB and return a list of them
    users = db.query(User).all()
    return users

def construct_final_foodex_code(base_term: str, facets: list) -> str:
    facet_codes = [facet.code for facet in facets]
    joined_codes = '$'.join(facet_codes)
    
    if len(facet_codes) > 0 and facet_codes[0] != '':
        return f"{base_term}#{joined_codes}"
    else:
        return base_term
    
def construct_final_foodex_code_of_processed_ingredient(base_term: str, facets: list) -> str:
    facet_codes = [facet.code for facet in facets]
    joined_codes = '$'.join(facet_codes)
    
    if len(facet_codes) > 0 and facet_codes[0] != '':
        if len(base_term) == 5:
            return f"{base_term}#{joined_codes}"
        else:
            return f"{base_term}${joined_codes}"
    else:
        return base_term



def create_ingredient(db: Session, ingredient: IngredientCreate, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    final_foodex_code = construct_final_foodex_code(ingredient.ingredient_base_term, ingredient.ingredient_with_facets)

    #existing_ingredient = db.query(Ingredient).filter(Ingredient.final_Foodex_code == final_foodex_code).first()
    existing_ingredient = db.query(Ingredient).filter(
    Ingredient.final_Foodex_code == final_foodex_code,
    Ingredient.place_of_origin == ingredient.place_of_origin
    ).first()

    print(existing_ingredient)
    if existing_ingredient:
        raise HTTPException(
                status_code=400,
                detail={"message": "Ingredient already exists with the same final_Foodex_code and place of origin", "ingredient_id": existing_ingredient.id}
            )

    ingredient_with_facets = [facet.dict() for facet in ingredient.ingredient_with_facets]
    description=[desc.dict() for desc in ingredient.description] if ingredient.description else None

    if "#" in final_foodex_code or "$" in final_foodex_code:
        foodex_code_for_recipes = "F26.A07XE"
    else:
        foodex_code_for_recipes = "F04."+final_foodex_code

    db_ingredient = Ingredient(
        ingredient_name=ingredient.ingredient_name,
        ingredient_base_term=ingredient.ingredient_base_term,
        ingredient_base_term_name=ingredient.ingredient_base_term_name,
        ingredient_with_facets=ingredient_with_facets,
        place_of_origin=ingredient.place_of_origin,
        is_POP=ingredient.is_POP,
        is_PGE=ingredient.is_PGE,
        latin_name=ingredient.latin_name,
        greek_name=ingredient.greek_name,
        greek_alter_name=ingredient.greek_alter_name,
        description=description,
        owner_id=user_id,
        final_Foodex_code=final_foodex_code,
        foodex_Code_for_recipes = foodex_code_for_recipes

    )
    try:
        db.add(db_ingredient)
        db.commit()
        db.refresh(db_ingredient)
        logging.debug(f"Created new ingredient: {db_ingredient}")
        print(f"Created new ingredient: {db_ingredient}")
        print(db_ingredient)
        return db_ingredient
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Ingredient already exists")


def update_ingredient_description(db: Session, ingredient_id: int, user_input: str):
    ingredient = db.query(Ingredient).get(ingredient_id)
    if ingredient:
        logging.debug(f"Updating ingredient ID {ingredient_id} with new description: {user_input}")
        print(f"Updating ingredient ID {ingredient_id} with new description: {user_input}")
        
        if ingredient.description is None:
            ingredient.description = []

        logging.debug(f"Current description before update: {ingredient.description}")
        print(f"Current description before update: {ingredient.description}")

        updated_description = ingredient.description + [{'user_input': user_input}]

        try:
            ingredient.description = updated_description
            db.commit()
            db.refresh(ingredient)
            logging.debug(f"Updated ingredient: {ingredient.description}")
            print(f"Updated ingredient: {ingredient.description}")
            return ingredient
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Failed to update ingredient description")
    else:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    

def get_ingredient(db: Session, ingredient_id: int):
    db_ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return db_ingredient

def create_processed_ingredient(db: Session, processed_ingredient: ProcessedIngredientCreate, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    final_foodex_code = construct_final_foodex_code_of_processed_ingredient(processed_ingredient.processed_ingredient_base_term, processed_ingredient.processed_ingredient_with_facets)

    existing_processed_ingredient = db.query(ProcessedIngredient).filter(ProcessedIngredient.final_Foodex_code == final_foodex_code).first()
    print(existing_processed_ingredient)
    if existing_processed_ingredient:
        raise HTTPException(
                status_code=400,
                detail={"message": "Processed ingredient already exists with the same final_Foodex_code", "ingredient_id": existing_processed_ingredient.id}
            )

    processed_ingredient_with_facets = [facet.dict() for facet in processed_ingredient.processed_ingredient_with_facets]
    description=[desc.dict() for desc in processed_ingredient.description] if processed_ingredient.description else None

    db_processed_ingredient = ProcessedIngredient(
        processed_ingredient_name=processed_ingredient.processed_ingredient_name,
        processed_ingredient_base_term=processed_ingredient.processed_ingredient_base_term,
        processed_ingredient_base_term_name=processed_ingredient.processed_ingredient_base_term_name,
        processed_ingredient_with_facets=processed_ingredient_with_facets,
        
        description=description,
        owner_id=user_id,
        final_Foodex_code=final_foodex_code
    )
    try:
        db.add(db_processed_ingredient)
        db.commit()
        db.refresh(db_processed_ingredient)
        return db_processed_ingredient
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Processed ingredient already exists")

def get_processed_ingredient(db: Session, user_id: int):
    db_processed_ingredient = db.query(ProcessedIngredient).filter(ProcessedIngredient.owner_id == user_id).all()
    if db_processed_ingredient is None:
        raise HTTPException(status_code=404, detail="Processed ingredient not found")
    return db_processed_ingredient


        
def construct_final_foodex_code_with_existing_ingredients(base_term: str, facets: list, existing_ingredient: List[Ingredient]) -> str:
    facet_codes = [facet.code for facet in facets]

    for item in existing_ingredient:
        if item.ingredient_base_term in facet_codes:
            index = facet_codes.index(item.ingredient_base_term)
            facet_codes[index] = item.foodex_Code_for_recipes

    joined_codes = '$'.join(facet_codes) if facet_codes else ''
    
    if facet_codes and facet_codes[0] == '':
        return base_term
    
    return f"{base_term}#{joined_codes}" if joined_codes else base_term

def construct_final_foodex_code_with_existing_ingredients2(base_term: str, facets: list, existing_ingredient: List[Ingredient]) -> str:
    facet_codes = []
    # Διατρέχουμε τη λίστα και προσθέτουμε τα κλειδιά 'code' στη λίστα 'codes'
    for item in facets:
        facet_codes.append(item['code'])

    # Τώρα η μεταβλητή 'codes' θα περιέχει τα κλειδιά 'code' από όλα τα στοιχεία της λίστας 'items'
    print(facet_codes)


    for item in existing_ingredient:
        if item.ingredient_base_term in facet_codes:
            index = facet_codes.index(item.ingredient_base_term)
            facet_codes[index] = item.foodex_Code_for_recipes

    joined_codes = '$'.join(facet_codes) if facet_codes else ''
    
    if facet_codes and facet_codes[0] == '':
        return base_term
    
    return f"{base_term}#{joined_codes}" if joined_codes else base_term



def create_recipe(db: Session, recipe: RecipeCreate, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    final_foodex_code = None

    # Check if any ingredient in recipe_with_facets already exists in ingredients table
    existing_ingredient_list = []
    for facet in recipe.recipe_with_facets:
        existing_ingredient = db.query(Ingredient).filter(
            Ingredient.ingredient_name == facet.name, 
            Ingredient.ingredient_base_term == facet.code
        ).first()
        if existing_ingredient:
            existing_ingredient_list.append(existing_ingredient)

    final_foodex_code = construct_final_foodex_code_with_existing_ingredients(
        recipe.recipe_base_term, 
        recipe.recipe_with_facets, 
        existing_ingredient_list
    )        

    if not final_foodex_code:
        final_foodex_code = construct_final_foodex_code(recipe.recipe_base_term, recipe.recipe_with_facets)

    existing_recipe = db.query(Recipe).filter(
        Recipe.final_Foodex_code == final_foodex_code
    ).first()
    
    if existing_recipe:
        raise HTTPException(
            status_code=400,
            detail={"message": "Recipe already exists with the same final_Foodex_code", "recipe_id": existing_recipe.id}
        )

    recipe_with_facets = [facet.dict() for facet in recipe.recipe_with_facets]
    description = [desc.dict() for desc in recipe.description] if recipe.description else None
    processed_ingredients_info = [info.dict() for info in recipe.processed_ingredients_info] if recipe.processed_ingredients_info else None

    db_recipe = Recipe(
        recipe_name=recipe.recipe_name,
        recipe_base_term=recipe.recipe_base_term,
        recipe_base_term_name=recipe.recipe_base_term_name,
        recipe_with_facets=recipe_with_facets,
        place_of_origin=recipe.place_of_origin,
        is_POP=recipe.is_POP,
        is_PGE=recipe.is_PGE,
        mediterranean_diet_category=recipe.mediterranean_diet_category,
        nova_system_category=recipe.nova_system_category,
        latin_name=recipe.latin_name,
        greek_name=recipe.greek_name,
        greek_alter_name=recipe.greek_alter_name,
        instructions=recipe.instructions,
        description=description,
        processed_ingredients_info=processed_ingredients_info,
        owner_id=user_id,
        final_Foodex_code=final_foodex_code
    )

    try:
        db.add(db_recipe)
        db.commit()
        db.refresh(db_recipe)

        # Update the many-to-many relationship between recipes and ingredients
        for facet in recipe_with_facets:
            ingredient = db.query(Ingredient).filter(
                Ingredient.ingredient_name == facet['name'], 
                Ingredient.ingredient_base_term == facet['code']
            ).first()
            if ingredient:
                association = IngredientRecipe(
                    recipe_id=db_recipe.id, 
                    ingredient_id=ingredient.id, 
                    amount=facet['amount']
                )
                db.add(association)

        db.commit()

        if processed_ingredients_info is not None:
            # Update the many-to-many relationship between recipes and processed ingredients
            for info in processed_ingredients_info:
                processed_ingredient = db.query(ProcessedIngredient).filter(
                    ProcessedIngredient.final_Foodex_code == info['final_Foodex_code']
                ).first()
                if not processed_ingredient:
                    logging.warning(f"ProcessedIngredient with final_Foodex_code {info['final_Foodex_code']} not found")
                    continue  # Skip this processed ingredient and continue with the others
                if processed_ingredient:
                    association = ProcessedIngredientRecipe(
                        recipe_id=db_recipe.id, 
                        processed_ingredient_id=processed_ingredient.id, 
                        # amount=info['amount']
                    )
                    db.add(association)

            db.commit()

        logging.debug(f"Created new recipe: {db_recipe}")
        return db_recipe

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Recipe already exists")
    except ValueError as ve:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="An unexpected error occurred")



def update_recipe_description(db: Session, recipe_id: int, user_input: str):
    recipe = db.query(Recipe).get(recipe_id)
    if recipe:
        logging.debug(f"Updating recipe ID {recipe_id} with new description: {user_input}")
        
        if recipe.description is None:
            recipe.description = []

        logging.debug(f"Current description before update: {recipe.description}")

        updated_description = recipe.description + [{'user_input': user_input}]

        try:
            recipe.description = updated_description
            db.commit()
            db.refresh(recipe)
            logging.debug(f"Updated recipe: {recipe.description}")
            return recipe
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Failed to update recipe description")
    else:
        raise HTTPException(status_code=404, detail="Recipe not found")



def get_recipes(db: Session, user_id: int):
    db_recipe = db.query(Recipe).filter(Recipe.owner_id == user_id).all()
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

def get_ingredients_by_user(db: Session, user_id: int):
    db_ingredient = db.query(Ingredient).filter(Ingredient.owner_id == user_id).all()
    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return db_ingredient


# Strip accents and convert to lowercase
def strip_accents_and_lowercase(s: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn').lower()

# Search ingredients function
def search_ingredients(db: Session, search_item: str):
    normalized_search_item = strip_accents_and_lowercase(search_item)
    ingredients = db.query(Ingredient).all()
    
    normalized_ingredients = [
        ingredient for ingredient in ingredients 
        if normalized_search_item in strip_accents_and_lowercase(ingredient.ingredient_name) 
        or normalized_search_item in strip_accents_and_lowercase(ingredient.greek_name)
        or normalized_search_item in strip_accents_and_lowercase(ingredient.greek_alter_name)
        or any(
        normalized_search_item in strip_accents_and_lowercase(desc['user_input'])
        for desc in ingredient.description
        )
    ]
    
    return normalized_ingredients

def search_processed_ingredients(db: Session, search_item: str):
    normalized_search_item = strip_accents_and_lowercase(search_item)
    processed_ingredients = db.query(ProcessedIngredient).all()
    
    
    normalized_ingredients = [
        processed_ingredient for processed_ingredient in processed_ingredients 
        if normalized_search_item in strip_accents_and_lowercase(processed_ingredient.processed_ingredient_name)
        or any(
        normalized_search_item in strip_accents_and_lowercase(desc['user_input'])
        for desc in processed_ingredient.description
        )
    ]
    
    return normalized_ingredients


def search_recipes(db: Session, search_item: str):
    normalized_search_item = strip_accents_and_lowercase(search_item)
    recipes = db.query(Recipe).all()
    
    
    normalized_recipes = [
        recipe for recipe in recipes 
        if normalized_search_item in strip_accents_and_lowercase(recipe.recipe_name)

    ]
    
    return normalized_recipes


def get_admin_id(db: Session):
    admin = db.query(User).filter(User.username == admin_username).first()
    if admin:
        return admin.id
    return None

def transfer_user_data_to_admin(db: Session, user_id: int, admin_id: int):
    # Μεταφορά συνταγών
    recipes = db.query(Recipe).filter(Recipe.owner_id == user_id).all()
    for recipe in recipes:
        recipe.owner_id = admin_id
        db.add(recipe)
    
    # Μεταφορά συστατικών
    ingredients = db.query(Ingredient).filter(Ingredient.owner_id == user_id).all()
    for ingredient in ingredients:
        ingredient.owner_id = admin_id
        db.add(ingredient)
    
    # Μεταφορά επεξεργασμένων συστατικών
    processed_ingredients = db.query(ProcessedIngredient).filter(ProcessedIngredient.owner_id == user_id).all()
    for processed_ingredient in processed_ingredients:
        processed_ingredient.owner_id = admin_id
        db.add(processed_ingredient)
    
    db.commit()

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    admin_id = get_admin_id(db)

    if user:
        if user.id != admin_id:
            
            if admin_id:
                # Μεταφορά εγγραφών στον admin
                transfer_user_data_to_admin(db, user_id, admin_id)
                
                # Διαγραφή του χρήστη
                db.delete(user)
                db.commit()
                return True
    return False


def delete_ingredient(db: Session, ingredient_id: int):
    ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    # Βρες όλες τις συνταγές που περιέχουν το συστατικό
    recipes = db.query(Recipe).join(IngredientRecipe).filter(IngredientRecipe.ingredient_id == ingredient_id).all()
    
    # Διαγραφή των σχέσεων μεταξύ του συστατικού και των συνταγών από τον many-to-many πίνακα
    relationships = db.query(IngredientRecipe).filter(IngredientRecipe.ingredient_id == ingredient_id).all()
    if relationships:
        for relationship in relationships:
            db.delete(relationship)
    
    # Διαγραφή των συνταγών που περιέχουν το συστατικό
    if recipes:
        for recipe in recipes:
            db.delete(recipe)

    # Διαγραφή του συστατικού
    db.delete(ingredient)
    db.commit()

    return {"message": "Ingredient and related recipes deleted successfully"}

def delete_recipe(db: Session, recipe_id: int):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # Αποθήκευση των ingredient_recipe που αντιστοιχουν στο recipe που θελει να διαγραψει
    ingredient_recipes = db.query(IngredientRecipe).filter(IngredientRecipe.recipe_id == recipe_id).all()

    # Διαγραφη της εγγραφης recipe
    db.delete(recipe)
    db.commit()

    # Διαγραφη των σχεσεων
    if ingredient_recipes:
        for ir in ingredient_recipes:
            db.delete(ir)
        db.commit()

    return {"message": "Recipe and related ingredient-recipe relationships deleted successfully"}


def delete_processed_ingredient(db: Session, processed_ingredient_id: int):
    processed_ingredient = db.query(ProcessedIngredient).filter(ProcessedIngredient.id == processed_ingredient_id).first()
    if not processed_ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    # Βρες όλες τις συνταγές που περιέχουν το συστατικό
    recipes = db.query(Recipe).join(ProcessedIngredientRecipe).filter(ProcessedIngredientRecipe.processed_ingredient_id == processed_ingredient_id).all()
    
    # Διαγραφή των σχέσεων μεταξύ του συστατικού και των συνταγών από τον many-to-many πίνακα
    relationships = db.query(ProcessedIngredientRecipe).filter(ProcessedIngredientRecipe.processed_ingredient_id == processed_ingredient_id).all()
    if relationships:
        for relationship in relationships:
            db.delete(relationship)
    
    # Διαγραφή των συνταγών που περιέχουν το συστατικό
    if recipes:
        for recipe in recipes:
            db.delete(recipe)

    # Διαγραφή του συστατικού
    db.delete(processed_ingredient)
    db.commit()

    return {"message": "Processed ingredient and related recipes deleted successfully"}



def update_ingredient(db: Session, ingredient_id: int, ingredient_data: IngredientCreate):
    db_ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if not db_ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    # Check if the final_Foodex_code will change
    new_final_foodex_code = construct_final_foodex_code(
        ingredient_data.ingredient_base_term, ingredient_data.ingredient_with_facets
    )
    if new_final_foodex_code != db_ingredient.final_Foodex_code:
        existing_ingredient = db.query(Ingredient).filter(
            Ingredient.final_Foodex_code == new_final_foodex_code
        ).first()
        if existing_ingredient and existing_ingredient.id != ingredient_id:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Ingredient already exists with the same final_Foodex_code",
                    "ingredient_id": existing_ingredient.id,
                },
            )

    # Update the ingredient fields
    for field, value in ingredient_data.dict(exclude_unset=True).items():
        setattr(db_ingredient, field, value)

    # Update or reconstruct final_Foodex_code and foodex_Code_for_recipes if necessary
    if new_final_foodex_code != db_ingredient.final_Foodex_code:
        db_ingredient.final_Foodex_code = new_final_foodex_code
        if "#" in new_final_foodex_code or "$" in new_final_foodex_code:
            db_ingredient.foodex_Code_for_recipes = "F26.A07XE"
        else:
            db_ingredient.foodex_Code_for_recipes = "F04." + new_final_foodex_code

    try:
        db.commit()
        db.refresh(db_ingredient)
        update_recipes_with_ingredient(db, db_ingredient)
        return db_ingredient
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update ingredient: {str(e)}")


def update_recipes_with_ingredient(db: Session, updated_ingredient: Ingredient):
    association_table = IngredientRecipe.__table__

    recipes_using_ingredient = db.query(Recipe).join(association_table, Recipe.id == association_table.c.recipe_id).filter(
        association_table.c.ingredient_id == updated_ingredient.id
    ).all()

    for recipe in recipes_using_ingredient:
        existing_ingredient_list = []
        for facet in recipe.recipe_with_facets:
            existing_ingredient = db.query(Ingredient).filter(
                Ingredient.ingredient_name == facet['name'],
                Ingredient.ingredient_base_term == facet['code']
            ).first()

            if existing_ingredient:
                existing_ingredient_list.append(existing_ingredient)

            for facet in recipe.recipe_with_facets:
                if facet['code'] == updated_ingredient.ingredient_base_term:
                    facet['name'] = updated_ingredient.ingredient_name  # Update the name

        final_foodex_code = construct_final_foodex_code_with_existing_ingredients2(
            recipe.recipe_base_term,
            recipe.recipe_with_facets,
            existing_ingredient_list
        )

        recipe.final_Foodex_code = final_foodex_code
        
        db.add(recipe)
        db.commit()
        db.refresh(recipe)

    

def get_recipes_from_origin(db: Session, place_of_origin: str = None) -> List[Recipe]:
    query = db.query(Recipe)
    if place_of_origin:
        query = query.filter(Recipe.place_of_origin == place_of_origin)
    recipes = query.all()
    return recipes