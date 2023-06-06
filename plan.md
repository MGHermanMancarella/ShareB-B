****ShareB&B»
As we move towards a world where people share more and more things, it’s time we build an application where users can share outdoor spaces like backyards or pools!

Users should be able to search for homes and apartments to with an outdoor space to rent
Authenticated users should be able to post a listing with photos, a price, and details of the private outdoor space
Authenticated users I should be able to message other users to ask questions about listings and book them
Photos should be stored in Amazon S3, not in a database
Users should be able to search for a listing
As a bonus, include an interface with a map that updates with listings when moved

1. Display rental listings
    - Access to Database (s3 access images)
    - Generate JSX/HTML (s3 access images)
    - Form for searching
2. Navigation / Routes
    - Home
    - Listings
    - Login 
      - User info
        - name, location, owned listings
    - Register (login on successful reg)
    - PostListingForm 
      - Photos (s3 access images)
      - Price
      - Details
3. Booking
4. Messages
5. Map
   

**FrontEnd**
React
- Authentication: JWT
  - state
  - UserContext
  - localStorage
- axios / API requests

**BackEnd**
Node >>> Express
- Authentication: JWT
- SQL queries and updates
  - JSONSchema
  - 

**DataBase**
PostGreSQL 
Amazon s3 (image storage)

1. Comp Hierarchy 
2. DB structure
3. Create React App
4. Write SQL DB file
