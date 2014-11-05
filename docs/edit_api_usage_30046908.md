#Functionality Validation

> Run the app first.

###1. Create a DRAFT challenge.
Navigate to url ```http://localhost:8000```. Then the browser will auto redirect to ```http://localhost:8000/manage/#/challenges```. Click the **+ New Challenge** button and the app will create a new DRAFT challenge. 

After this the url will become to something like ```http://localhost:8000/edit/#/challenges/177/edit``` which contains a challengeId, in this case it is 177. 

Visit ```http://lc1-challenge-service.herokuapp.com/challenges/177``` in your browser to verify the result in remote server. "177" is the challengeId which you must modify to match to the challenge your created. You will see a json reponse in return.

###2. Information for Public Browsing Section
This section has 3 fields.