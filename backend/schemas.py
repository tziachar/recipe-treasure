# Το pydantic.BaseModel αποτελεί τη βάση από όπου τα models κληρονομούν την κλάση BaseModel κατά την αρχικοποίησή τους, το EmailStr αποτελεί έναν ειδικό τύπο δεδομένων για την ορθή διαχείριση των emails και το Field για τον ορισμό επιπλέον παραμέτρων των πεδίων των μοντέλων.
from pydantic import BaseModel, Field, EmailStr
from typing import Dict, List, Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str


class Facet(BaseModel):
    name: str
    code: str

class FacetForRecipe(Facet):
    amount: str

class Description(BaseModel):
    user_input: str

class Processed_Ingredient_Info(BaseModel):
    processed_ingredient_name: str
    # amount: Optional[str] = None
    final_Foodex_code: str

class IngredientBase(BaseModel):
    ingredient_name: str
    ingredient_base_term: Optional[str] = None
    ingredient_base_term_name: Optional[str] = None
    ingredient_with_facets: List[Facet] = Field(default_factory=list)
    place_of_origin: Optional[str] = None
    is_POP: Optional[bool] = None
    is_PGE: Optional[bool] = None
    latin_name: Optional[str] = None
    greek_name: Optional[str] = None
    greek_alter_name: Optional[str] = None
    description: Optional[List[Description]] = Field(default_factory=list)

class IngredientCreate(IngredientBase):
    pass

class IngredientOut(IngredientBase):
    id: int
    final_Foodex_code: Optional[str] = None
    foodex_Code_for_recipes: str

    class Config:

        from_attributes = True

class ProcessedIngredientBase(BaseModel):
    processed_ingredient_name: str
    processed_ingredient_base_term: Optional[str] = None
    processed_ingredient_base_term_name: Optional[str] = None
    processed_ingredient_with_facets: List[Facet] = Field(default_factory=list)
    
    description: Optional[List[Description]] = Field(default_factory=list)

class ProcessedIngredientCreate(ProcessedIngredientBase):
    pass

class ProcessedIngredientOut(ProcessedIngredientBase):
    id: int
    final_Foodex_code: Optional[str] = None

    class Config:

        from_attributes = True

class RecipeBase(BaseModel):
    recipe_name: str
    recipe_base_term: Optional[str] = None
    recipe_base_term_name: Optional[str] = None
    recipe_with_facets: List[FacetForRecipe] = Field(default_factory=list)
    place_of_origin: Optional[str] = None
    is_POP: Optional[bool] = None
    is_PGE: Optional[bool] = None
    mediterranean_diet_category: Optional[str] = None
    nova_system_category: Optional[str] = None
    latin_name: Optional[str] = None
    greek_name: Optional[str] = None
    greek_alter_name: Optional[str] = None
    instructions: Optional[str] = None
    description: Optional[List[Description]] = Field(default_factory=list)
    processed_ingredients_info: Optional[List[Processed_Ingredient_Info]] = Field(default_factory=list)

class RecipeCreate(RecipeBase):
    pass

class RecipeOut(RecipeBase):
    id: int
    ingredients: List[IngredientOut] = []
    processed_ingredients: List[ProcessedIngredientOut] = []
    final_Foodex_code: Optional[str] = None

    class Config:

        from_attributes = True

class UserOut(UserBase):
    id: int
    
    recipes: List[RecipeOut] = []
    ingredients: List[IngredientOut] = []
    processed_ingredients: List[ProcessedIngredientOut] = []

    class Config:

        from_attributes = True
