from typing import List
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import torch
from database import engine, Base, get_db
import schemas
import services
import similarity_search_service as search
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm.exc import ObjectDeletedError
from transformers import BertTokenizer, BertModel


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3000/login"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Create all tables
Base.metadata.create_all(bind=engine)


# ENDPOINTS 

@app.post("/login", tags=["users"])
def login(username: str, password: str, db: Session = Depends(get_db)):
    user, is_admin = services.authenticate_user(db, username, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user.id, "is_admin": is_admin}


@app.post("/users/", response_model=schemas.UserOut, tags=["users"])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return services.create_user(db, user)

@app.get("/users/", response_model=List[schemas.UserOut], tags=["admin"])
def read_users(db: Session = Depends(get_db)):
    return services.get_users(db)

@app.post("/ingredients/", response_model=schemas.IngredientOut, tags=["ingredients"])
def create_ingredient(ingredient: schemas.IngredientCreate, user_id: int, db: Session = Depends(get_db)):
    return services.create_ingredient(db, ingredient, user_id)


@app.put("/ingredients/{ingredient_id}/description/{description}", response_model=schemas.IngredientOut, tags=["ingredients"])
def update_ingredient_description(ingredient_id: int, description: str, db: Session = Depends(get_db)):
    return services.update_ingredient_description(db, ingredient_id, description)


@app.get("/ingredients/{ingredient_id}", response_model=schemas.IngredientOut, tags=["ingredients"])
def read_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    return services.get_ingredient(db, ingredient_id)

@app.post("/processed_ingredients/", response_model=schemas.ProcessedIngredientOut, tags=["processed_ingredients"])
def create_processed_ingredient(processed_ingredient: schemas.ProcessedIngredientCreate, user_id: int, db: Session = Depends(get_db)):
    return services.create_processed_ingredient(db, processed_ingredient, user_id)

@app.get("/processed_ingredients/{user_id}", response_model=List[schemas.ProcessedIngredientOut], tags=["processed_ingredients"])
def read_processed_ingredient(user_id: int, db: Session = Depends(get_db)):
    return services.get_processed_ingredient(db, user_id)

@app.post("/recipes/", response_model=schemas.RecipeOut, tags=["recipes"])
def create_recipe(recipe: schemas.RecipeCreate, user_id: int, db: Session = Depends(get_db)):
    return services.create_recipe(db, recipe, user_id)


@app.put("/recipes/{recipe_id}/description/{description}", tags=["recipes"])
def update_recipe_description_endpoint(recipe_id: int, description: str, db: Session = Depends(get_db)):
    return services.update_recipe_description(db, recipe_id, description)

@app.get("/recipes/{user_id}", response_model=List[schemas.RecipeOut], tags=["recipes"])
def read_recipe(user_id: int, db: Session = Depends(get_db)):
    return services.get_recipes(db, user_id)

@app.get("/ingredients/user/{user_id}", response_model=List[schemas.IngredientOut], tags=["ingredients"])
def read_ingredients(user_id: int, db: Session = Depends(get_db)):
    return services.get_ingredients_by_user(db, user_id)

# API endpoint to search terms via term
@app.get("/search_terms/{term}", tags=["search_terms"])
async def search_terms(term: str):
    query_vector = search.model.encode([term])
    D, I = search.term_index.search(query_vector, 10)
    return [f'{search.alltermcodes[i]}: {search.alltermnames[i]}: {search.alldescriptions[i]}' for i in I[0]]

# API endpoint to search  via desc
@app.get("/search_terms2/{term}", tags=["search_terms"])
async def search_terms(term: str):
    query_vector = search.model.encode([term])
    D, I = search.desc_index.search(query_vector, 10)
    return [f'{search.alltermcodes[i]}: {search.alltermnames[i]}: {search.alldescriptions[i]}' for i in I[0]]


# model_name = "nlpaueb/bert-base-greek-uncased-v1"
# tokenizer = BertTokenizer.from_pretrained(model_name)
# model = BertModel.from_pretrained(model_name)


@app.get("/search_ingredient/", tags=["search_terms"])
async def analyze_text(search_item: str, db: Session = Depends(get_db)):
    # Αναζήτηση στη βάση δεδομένων
    ingredients = services.search_ingredients(db, search_item)

    # # Tokenization του κειμένου
    # input_ids = tokenizer.encode(search_item, return_tensors="pt")

    # # Εκτέλεση του μοντέλου
    # with torch.no_grad():
    #     outputs = model(input_ids)

    # # Επιστροφή των ενσωματωμένων αναπαραστάσεων του κειμένου από το τελευταίο layer του Greek-BERT
    # bert_embeddings = outputs.last_hidden_state.tolist()

    if len(ingredients) == 0:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ingredients

@app.get("/search_processed_ingredient/", tags=["search_terms"])
async def analyze_text(search_item: str, db: Session = Depends(get_db)):
    # Αναζήτηση στη βάση δεδομένων
    processed_ingredients = services.search_processed_ingredients(db, search_item)

    # # Tokenization του κειμένου
    # input_ids = tokenizer.encode(search_item, return_tensors="pt")

    # # Εκτέλεση του μοντέλου
    # with torch.no_grad():
    #     outputs = model(input_ids)

    # # Επιστροφή των ενσωματωμένων αναπαραστάσεων του κειμένου από το τελευταίο layer του Greek-BERT
    # bert_embeddings = outputs.last_hidden_state.tolist()

    if len(processed_ingredients) == 0:
        raise HTTPException(status_code=404, detail="Processed ingredient not found")
    return processed_ingredients


@app.get("/search_recipe/", tags=["search_terms"])
async def analyze_text(search_item: str, db: Session = Depends(get_db)):
    # Αναζήτηση στη βάση δεδομένων
    recipes = services.search_recipes(db, search_item)

    # # Tokenization του κειμένου
    # input_ids = tokenizer.encode(search_item, return_tensors="pt")

    # # Εκτέλεση του μοντέλου
    # with torch.no_grad():
    #     outputs = model(input_ids)

    # # Επιστροφή των ενσωματωμένων αναπαραστάσεων του κειμένου από το τελευταίο layer του Greek-BERT
    # bert_embeddings = outputs.last_hidden_state.tolist()

    if len(recipes) == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipes



@app.delete("/users/{user_id}", tags=["admin"] )
def delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted = services.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User with id {user_id} has been deleted"}

@app.delete("/ingredients/{ingredient_id}", tags=["admin"])
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    deleted = services.delete_ingredient(db, ingredient_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return {"message": f"Ingredient with id {ingredient_id} has been deleted"}


# @app.delete("/recipes/{recipe_id}", tags=["admin"])
# def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
#     return services.delete_recipe(db, recipe_id)

@app.delete("/recipes/{recipe_id}", tags=["admin"])
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    try:
        return services.delete_recipe(db, recipe_id)
    except ObjectDeletedError as e:
        # Αντιδράστε στο σφάλμα εδώ, π.χ. επιστροφή μήνυμα σφάλματος ή αντίστοιχο
        return {"error": "Recipe not found or already deleted"}, 404

@app.delete("/processed_ingredients/{processed_ingredient_id}", tags=["admin"])
def delete_ingredient(processed_ingredient_id: int, db: Session = Depends(get_db)):
    deleted = services.delete_processed_ingredient(db, processed_ingredient_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Processed ingredient not found")
    return {"message": f"Ingredient with id {processed_ingredient_id} has been deleted"}


@app.put("/ingredients/{ingredient_id}", response_model=schemas.IngredientOut, tags=["admin"])
def update_ingredient(
    ingredient_id: int,
    ingredient_data: schemas.IngredientCreate,
    db: Session = Depends(get_db)
):
    return services.update_ingredient(db, ingredient_id, ingredient_data)



@app.get("/recipes/from_region/{place_of_origin}", response_model=List[schemas.RecipeOut], tags=["recipes"])
def read_recipes_from_region(place_of_origin: str, db: Session = Depends(get_db)):
    return services.get_recipes_from_origin(db, place_of_origin)

