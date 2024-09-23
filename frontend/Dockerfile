# Επιλέγουμε το image του Node.js
FROM node:18

# Ορίζουμε τον working directory στο container
WORKDIR /app

# Αντιγράφουμε το package.json και εγκαθιστούμε τις εξαρτήσεις
COPY package*.json ./
RUN npm install

# Αντιγράφουμε όλο το περιεχόμενο του φακέλου frontend στο container
COPY . .

# Δημιουργούμε το build του React app
RUN npm run build

# Εξυπηρετούμε το frontend από τον web server
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Εκθέτουμε το port 3000
EXPOSE 3000
