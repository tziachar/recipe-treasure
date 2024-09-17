from sqlalchemy import Column, Float, Integer, String, ForeignKey, Table, Boolean, JSON, Text # Για τον ορισμό των πεδίων των πινάκων και του τύπου δεδομένων τους
from sqlalchemy.orm import relationship # Για τον ορισμό της σχέσης μεταξύ των πινάκων
from database import Base # Αποτελεί την κλάση την οποία κληρονομούν οι κλάσεις που αναπαριστούν τους πίνακες της βάσης

# Δημιουργία κλάσης του βοηθητικού πίνακα ingredient_recipe όπως προκύπτει από την σχέση πολλά προς πολλά μεταξύ των πινάκων recipes και ingredients.
class IngredientRecipe(Base):
    __tablename__ = 'ingredient_recipe'
    recipe_id = Column(Integer, ForeignKey("recipes.id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), primary_key=True)
    amount = Column(String, nullable=False)


# Δημιουργία κλάσης του βοηθητικού πίνακα processed_ingredient_recipe όπως προκύπτει από την σχέση πολλά προς πολλά μεταξύ των πινάκων recipes και processed_ingredients.
class ProcessedIngredientRecipe(Base):
    __tablename__ = 'processed_ingredient_recipe'
    recipe_id = Column(Integer, ForeignKey("recipes.id"), primary_key=True)
    processed_ingredient_id = Column(Integer, ForeignKey("processed_ingredients.id"), primary_key=True)
    # amount = Column(String, nullable=False)

# Δημιουργία κλάσης του πίνακα users και των πεδίων του και η έκφραση της σχέσης ένα προς πολλά μεταξύ του users με τους πίνακες  ingredients, recipes και processed_ingredients αντίστοιχα.
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=False, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False) 
    ingredients = relationship("Ingredient", back_populates="owner")
    recipes = relationship("Recipe", back_populates="owner")
    processed_ingredients = relationship("ProcessedIngredient", back_populates="owner")

# Δημιουργία κλάσης του πίνακα ingredients και των πεδίων του και η έκφραση της σχέσης ένα προς πολλά μεταξύ του ingredients με τον πίνακα users και της σχέσης πολλά προς πολλά με τον πίνακα recipes.
class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    ingredient_name = Column(String, index=True)
    ingredient_base_term = Column(String, nullable=True)
    ingredient_base_term_name = Column(String, nullable=True)
    ingredient_with_facets = Column(JSON, nullable=True)
    place_of_origin = Column(String, nullable=True)
    is_POP = Column(Boolean, nullable=True)
    is_PGE = Column(Boolean, nullable=True)
    latin_name = Column(String, nullable=True)
    greek_name = Column(String, nullable=True)
    greek_alter_name = Column(String, nullable=True)
    description = Column(JSON, nullable=True)
    final_Foodex_code = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    foodex_Code_for_recipes = Column(String, index=True)
    owner = relationship("User", back_populates="ingredients")
    # recipes = relationship("Recipe", secondary="recipe_ingredient", back_populates="ingredients")
    recipes = relationship("Recipe", secondary="ingredient_recipe", back_populates="ingredients", lazy='subquery')


# Δημιουργία κλάσης του πίνακα processed_ingredients και των πεδίων του και η έκφραση της σχέσης ένα προς πολλά μεταξύ του processed_ingredients με τον πίνακα users και της σχέσης πολλά προς πολλά με τον πίνακα recipes.
class ProcessedIngredient(Base):
    __tablename__ = "processed_ingredients"
    id = Column(Integer, primary_key=True, index=True)
    processed_ingredient_name = Column(String, index=True)
    processed_ingredient_base_term = Column(String, nullable=True)
    processed_ingredient_base_term_name = Column(String, nullable=True)
    processed_ingredient_with_facets = Column(JSON, nullable=True)
    
    description = Column(JSON, nullable=True)
    final_Foodex_code = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="processed_ingredients")
    # recipes = relationship("Recipe", secondary="processed_ingredient_recipe", back_populates="processed_ingredients")
    recipes = relationship(
        "Recipe",
        secondary="processed_ingredient_recipe",
        back_populates="processed_ingredients",
        lazy='subquery'
    )


# Δημιουργία κλάσης του πίνακα recipes και των πεδίων του και η έκφραση της σχέσης ένα προς πολλά μεταξύ του recipes με τον πίνακα users και της σχέσης πολλά προς πολλά με τους πίνακες ingredients και processed_ingredients αντίστοιχα.
class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    recipe_name = Column(String, index=True)
    recipe_base_term = Column(String, nullable=True)
    recipe_base_term_name = Column(String, nullable=True)
    recipe_with_facets = Column(JSON, nullable=True)
    place_of_origin = Column(String, nullable=True)
    is_POP = Column(Boolean, nullable=True)
    is_PGE = Column(Boolean, nullable=True)
    mediterranean_diet_category = Column(String, nullable=True)
    nova_system_category = Column(String, nullable=True)
    latin_name = Column(String, nullable=True)
    greek_name = Column(String, nullable=True)
    greek_alter_name = Column(String, nullable=True)
    instructions = Column(String, nullable=True)
    description = Column(JSON, nullable=True)
    processed_ingredients_info = Column(JSON, nullable=True)
    final_Foodex_code = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="recipes")
    # ingredients = relationship("Ingredient", secondary=recipe_ingredient_table, back_populates="recipes")
    # processed_ingredients = relationship("ProcessedIngredient", secondary=processed_ingredient_recipe_table, back_populates="recipes")
    ingredients = relationship("Ingredient", secondary="ingredient_recipe", back_populates="recipes", lazy='subquery')
    processed_ingredients = relationship(
        "ProcessedIngredient",
        secondary="processed_ingredient_recipe",
        back_populates="recipes",
        lazy='subquery'
    )
