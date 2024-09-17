Η εφαρμογή Recipe-treasure αποτελεί προίόν της εκπόνησης της πτυχιακής εργασίας μου με θέμα "Ανάπτυξη εφαρμογής για τη δημιουργία θησαυρού συνταγών", το έτος 2024 για το Χαροκόπειο Πανεπιστήμιο. Το project περιέχει δύο διακριτά μέρη. Το 1ο αφορά στην υλοποίηση του backend με την χρήση του framework FastAPI και το 2ο αφορά στην υλοποίηση του frontend με την χρήση της βιβλιοθήκης React.

Για το setup του backend ακολουθούμε τα παρακάτω βήματα:

1. Αρχικά θα πρέπει να είναι εγκαταστημένη στο σύστημα η Python. Αν δεν είναι, τότε θα πρέπει να γίνει εγκατάστασή της. Η έκδοση της Python που χρησιμοποιήθηκε για το εν λόγω project είναι η Python 3.12.3.  Η έκδοση μπορεί να φανεί εκτελώντας στο terminal την εντολή
python --version
Αν το output επιστρέψει για παράδειγμα
Python 3.12.3
τότε η Python είναι εγκατεστημένη ήδη στο σύστημα.

3. Το project θα πρέπει να φιλοξενηθεί σε ένα directory σε κάποιο σημείο στον υπολογιστή δίνοντας ένα όνομα, όπως π.χ recipe-treasure-foodex-fullstack-project. Στο path C:\Users\tziac\Workspace εκτελείται η εντολή 
C:\Users\tziac\Workspace> mkdir recipe-treasure-foodex-fullstack-project
και με την εντολή 
C:\Users\tziac\Workspace> cd recipe-treasure-foodex-fullstack-project
γίνεται η μεταφορά μέσα στο directory του project.

5. Για να διασφαλιστεί ότι οι εξαρτήσεις (dependencies) του project είναι απομονωμένες από το υπόλοιπο σύστημα, θεωρείται καλή πρακτική να δημιουργηθεί ένα εικονικό περιβάλλον Python. Με την εντολή
C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project> python -m venv venv
δημιουργείται το εικονικό περιβάλλον venv.
Το εικονικό περιβάλλον θα πρέπει να ενεργοποιηθεί, κάτι που επιτυγχάνεται με την παρακάτω εντολή
C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project>.\venv\Scripts\activate
To output στο terminal είναι
(venv) PS C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project>

7. Έπειτα, γίνεται η εγκατάσταση όλων των απαραίτητων για το project dependencies, με την εντολή
(venv) PS C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project>pip install –r requirements.txt
Το αρχείο requirements.txt περιέχει όλα τα dependencies που χρειάζονται στην εφαρμογή και είναι καλή πρακτική να δημιουργείται για να μπορέσει να εκτελεστεί η παραπάνω εντολή. Το αρχείο με όλα τα dependencies που χρησιμοποιήθηκαν, βρίσκεται εδώ
https://github.com/tziachar/recipe-treasure-foodex-fullstack-project/blob/master/requirements.txt
οπότε μπορεί να αντιγραφεί στο path C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project για να τρέξει σωστά η εντολή pip install –r requirements.txt.

9. Έχοντας ολοκληρώσει την εγκατάσταση των dependencies, ακολουθεί η δημιουργία της βασικής δομής του project χρησιμοποιώντας τις παρακάτω εντολές
(venv) PS C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project>
mkdir backend
(venv) PS C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project> 
cd backend
(venv) PS C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project\ backend>

Δημιουργία βασικών φακέλων και αρχείων του backend
mkdir source
touch database.py
touch main.py
touch models.py
touch schemas.py
touch services.py
touch similarity_search_service.py
touch secret.env
Στο directory source θα πρέπει να περιέχονται κάποια αρχεία, τα οποία μπορούν να γίνουν download από εδώ
https://github.com/tziachar/recipe-treasure-foodex-fullstack-project/tree/master/backend/source
Το περιεχόμενο του file secret.env μπορεί να αποτελείται από τα εξής:
ADMIN_USERNAME=xxxxx
ADMIN_PASSWORD=xxxxx
ADMIN_EMAIL=xxxxx
Η δομή των φακέλων και των αρχείων θα πρέπει να είναι όπως στην εικόνα που ακολουθεί.

![image](https://github.com/user-attachments/assets/f1d4fe4e-22db-4151-89a5-e7db5bcebfd6)

* Θα πρέπει να είναι εγκατεστημένη βέβαια και η postgress στο σύστημα. Στο δικό μου σύστημα έχω την έκδοση 16.3. Το password που θα δοθει κατά την εγκατάσταση της postgress θα πρεπει να μπει και στο αρχείο database.py. Τέλος θα πρέπει να δημιουργηθεί μία νέα βάση δεδομένων π.χ όνομα RecipesTreasure.

Θα πρέπει για να τρέξει η εφαρμογή να εκτελεστεί η εντολή uvicorn main:app --reload στο directory backend.

Με αυτά τα βήματα έχει ολοκληρωθεί το βασικό structure του project στο backend. 
Σημείωση: Το __pycache__ μέσα στον φάκελο backend, είναι ένας φάκελος που δημιουργείται αυτόματα όταν τρέξει η εφαρμογή και εκτελεστεί ο κώδικας. Περιέχει αρχεία bytecode που έχουν μεταγλωττιστεί από τον Python interpreter. Αυτά τα αρχεία έχουν την επέκταση .pyc και είναι μεταγλωττισμένες εκδόσεις των αρχείων .py (Python source files).

Για το setup του frontend μπορεί να ακολουθηθούν τα παρακάτω βήματα:

1. Αρχικά στο σύστημα θα πρέπει να είναι εγκατεστημένο το runtime environment Node.js που επιτρέπει την εκτέλεση κώδικα javascript καθώς και το npm δηλαδή του εργαλείου με τη βοήθεια του οποίου γίνεται η διαχείριση των πακέτων και των dependencies. Οι εκδόσεις των Node.js και npm στο παρόν σύστημα που χρησιμοποιήθηκαν είναι η v20.12.2 και 10.5.0 αντίστοιχα.

2. Στην συνέχεια κάτω από το ίδιο directory δηλαδή στο path C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project που βρίσκεται και το backend της εφαρμογής, με την χρήση της εντολής 

C:\Users\tziac\Workspace\recipe-treasure-foodex-fullstack-project> npx create-react-app frontend

γίνεται η εγκατάσταση του React application εντός του directory με όνομα frontend μαζί με όλα τα dependencies που χρειάζεται η νέα αυτή εφαρμογή. Η δομή του έργου σε αυτό το σημείο, μετά την επιτυχή εκτέλεση της παραπάνω εντολής, απεικονίζεται παρακάτω:

![image](https://github.com/user-attachments/assets/5ea09ef7-d2c8-4635-ab3a-4e8b17edbdba)

Στην παραπάνω εικόνα παρατηρείται ότι έχουν εγκατασταθεί όλα τα απαραίτητα αρχεία και τα directories που είναι χρήσιμα για την ανάπτυξη της εφαρμογής στην συνέχεια. Στο directory src θα φιλοξενηθεί ολόκληρη η λογική που εφαρμόζεται μέσω της κατασκευής διάφορων components που θα παρουσιαστούν στην συνέχεια της ενότητας. Για τον λόγο αυτό, δημιουργείται ένα νέο directory με όνομα components και ένα directory με όνομα data, εντός του directory src, όπως φαίνεται στην επόμενη εικόνα. Να σημειωθεί ότι δεν χρειάζεται να γίνει κάποια επιπρόσθετη παραμετροποίηση στα αρχεία του περιβάλλοντος.

![image](https://github.com/user-attachments/assets/df2486cf-f0a3-46e5-92aa-4dd0b7d01e64)

Με αυτά τα απλά βήματα ολοκληρώνεται το setup  του περιβάλλοντος του frontend.

Τα αρχεία όλου του project καθώς και όλα τα components που δημιουργήθηκαν, μπορεί ο χρήστης που θέλει να εγκαταστήσει την εφαρμογή, να ανατρέξει στους φακέλους και να τα βρει και να τα χρησιμοποιήσει όπως είναι, όπως για παράδειγμα τα components που φαίνονται στις επόμενες εικόνες.

![image](https://github.com/user-attachments/assets/bb248109-6c09-44c6-b06c-d73dfbdffdec)
![image](https://github.com/user-attachments/assets/8ca8bfd7-10a6-409a-9a63-af7472e594a4)

 *Για όποιον θέλει να εγκαταστήσει την εφαρμογή στο σύστημά του, θα πρέπει αρχικά να κάνει clone το repository με τον κώδικα, μέσα σε ένα νέο φάκελο π.χ my -app.
 git clone -b master <remote-repo-url>
 
 *Μετά το clone θα πρέπει να δημιουργήσει ένα εικονικό περιβάλλον όπως αναφέρθηκε πιο πάνω, με την εντολή python -m venv venv και να το ενεργοποιήσει.
 
 *Έπειτα να εγκαταστήσει με την εντολή pip install –r requirements.txt όλα τα πακέτα της εφαρμογής.

 *Μέσα στο directory backend, να τρέξει την εντολή uvicorn main:app --reload σε ένα terminal.
 
 *Στην συνέχεια, για το frontend, μέσα στο directory frontend, να εγκαταστήσει τα πακέτα με την εντολή npm install. Αφού εγκατασταθούν θα εμφανιστεί το directory node_modules μέσα στο frontend.
 
 *Με την εντολή npm start σε ένα άλλο terminal, τρέχει το react app.
 
 *Η εφαρμογή τρέχει!
# recipe-treasure
