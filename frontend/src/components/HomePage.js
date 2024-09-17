import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import backgroundImage from '../data/grandma.jpg';

const HomePage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); 
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setImageLoaded(true);
    };
  }, []);

  const handleLogout = () => {
    setUser(null); // Clear the user information from the context
    localStorage.removeItem('user'); // Clear the user information from localStorage
    console.log(`user ${user ? user.username : ''} with id: ${user.id} is logged out`);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
  };

  const toggleSearchDropdown = () => {
    setSearchDropdownOpen(!searchDropdownOpen);
  };

  if (!imageLoaded) {
    return null; // Εμφανίζει το κενό μέχρι η εικόνα να φορτώσει
  }

  return (
    <div style={pageContainerStyle}>
      <div style={containerStyle}>
        <h2 style={welcomeStyle}>Welcome <strong style={{ color: 'green' }}>{user ? user.username : ''}</strong> to the Recipe Treasure App</h2>
        <nav style={navStyle}>
          <div style={navButtonsContainer}>
            <Link to="/add-ingredient">
              <button style={buttonStyle}>Add a New Ingredient</button>
            </Link>
            <Link to="/add-recipe">
              <button style={buttonStyle}>Add a New Recipe</button>
            </Link>

            {/* Dropdown for My inventory */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button onClick={toggleDropdown} style={buttonStyle}>
                My inventory
              </button>
              {isDropdownOpen && (
                <div style={dropdownStyle}>
                <Link to="/my-recipes" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      ...dropdownItemStyle,
                      backgroundColor: 'green',
                      transition: 'background-color 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'lightgreen';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'green';
                    }}
                  >
                    Show my recipes
                  </button>
                </Link>
                <Link to="/my-ingredients" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      ...dropdownItemStyle,
                      backgroundColor: 'green',
                      transition: 'background-color 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'lightgreen';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'green';
                    }}
                  >
                    Show my ingredients
                  </button>
                </Link>
                <Link to="/my-processed-ingredients" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      ...dropdownItemStyle,
                      backgroundColor: 'green',
                      transition: 'background-color 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'lightgreen';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'green';
                    }}
                  >
                    Show my processed ingredients
                  </button>
                </Link>
              </div>
              
              )}
            </div>

            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button onClick={toggleSearchDropdown} style={buttonStyle}>
                Search recipes
              </button>
              {searchDropdownOpen && (
                <div style={dropdownStyle}>


                  <Link to="/recipes-per-region" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      ...dropdownItemStyle,
                      backgroundColor: 'green',
                      transition: 'background-color 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'lightgreen';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'green';
                    }}
                  >
                    Recipes per region
                  </button>
                </Link>

                <Link to="/recipes-per-name" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      ...dropdownItemStyle,
                      backgroundColor: 'green',
                      transition: 'background-color 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'lightgreen';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'green';
                    }}
                  >
                    Recipes per name
                  </button>
                </Link>

                </div>
              )}
            </div>

            

            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>

            {user && user.isAdmin && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button onClick={toggleAdminDropdown} style={buttonStyleAdmin}>
                  Admin
                </button>
                {adminDropdownOpen && (
                  <div style={dropdownStyle}>
                    <Link to="/users/" style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          ...dropdownItemStyleAdmin,
                          backgroundColor: 'blue',
                          transition: 'background-color 0.3s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'lightblue';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'blue';
                        }}
                      >
                        Show users
                      </button>
                    </Link>
                    
                    <Link to="/delete-user" style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          ...dropdownItemStyleAdmin,
                          backgroundColor: 'blue',
                          transition: 'background-color 0.3s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'lightblue';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'blue';
                        }}
                      >
                        Delete User
                      </button>
                    </Link>
                    <Link to="/delete-ingredient" style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          ...dropdownItemStyleAdmin,
                          backgroundColor: 'blue',
                          transition: 'background-color 0.3s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'lightblue';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'blue';
                        }}
                      >
                        Delete Ingredient
                      </button>
                    </Link>
                    <Link to="/delete-recipe" style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          ...dropdownItemStyleAdmin,
                          backgroundColor: 'blue',
                          transition: 'background-color 0.3s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'lightblue';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'blue';
                        }}
                      >
                        Delete Recipe
                      </button>
                    </Link>
                    <Link to="/delete-processed-ingredient" style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          ...dropdownItemStyleAdmin,
                          backgroundColor: 'blue',
                          transition: 'background-color 0.3s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'lightblue';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'blue';
                        }}
                      >
                        Delete Processed Ingredient
                      </button>
                    </Link>


            
                    
                    <Link to="/update-ingredient" style={{ textDecoration: 'none' }}>
                      <button style={dropdownItemStyleAdmin}>Update Ingredient</button>
                    </Link>
                    <Link to="/update-recipe" style={{ textDecoration: 'none' }}>
                      <button style={dropdownItemStyleAdmin}>Update Recipe</button>
                    </Link>

                    
                  </div>
                )}
              </div>
            )}

          </div>
        </nav>
      </div>
    </div>
  );
};

const pageContainerStyle = {
  position: 'relative',
  minHeight: '100vh',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const containerStyle = {
  textAlign: 'center',
  padding: '20px',
  backgroundColor: 'black',
  borderRadius: '5px',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  boxSizing: 'border-box',
  zIndex: 1000,
};

const welcomeStyle = {
  fontSize: '18px',
  color: 'white',
  margin: 0,
};

const navStyle = {
  backgroundColor: 'black',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginTop: '10px',
};

const navButtonsContainer = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const buttonStyle = {
  fontSize: '14px',
  padding: '10px 20px',
  margin: '10px',
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.3s',
};

const buttonStyleAdmin = {
  fontSize: '14px',
  padding: '10px 20px',
  margin: '10px',
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.3s',
};

const dropdownStyle = {
  position: 'absolute',
  backgroundColor: 'white',
  boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
  zIndex: 1,
  borderRadius: '5px',
  overflow: 'hidden',
};

const dropdownItemStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  backgroundColor: 'green',
  color: 'white',
  textAlign: 'left',
  border: 'none',
  borderRadius: '0',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const dropdownItemStyleAdmin = {
  display: 'block',
  width: '100%',
  padding: '10px',
  backgroundColor: 'blue',
  color: 'white',
  textAlign: 'left',
  border: 'none',
  borderRadius: '0',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const logoutButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  fontSize: '14px',
  padding: '10px 20px',
  margin: '10px',
  width: '100px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.3s',
};

export default HomePage;
