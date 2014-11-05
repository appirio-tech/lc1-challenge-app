#Validations for the functionality in edit page

> This section contains all the validations for the functionality in edit page. Please have the node_modules and bower_compontes installed first and then run ```grunt``` to start the app.

### 1. Create a DRAFT challenge.
Navigate to url ```http://localhost:8000```. Then the browser will auto redirect to ```http://localhost:8000/manage/#/challenges```. Click the **+ New Challenge** button and the app will create a new DRAFT challenge. 

####Success
The url will become to something like ```http://localhost:8000/edit/#/challenges/177/edit``` which contains a challengeId, in this case it is 177. 

Visit ```http://lc1-challenge-service.herokuapp.com/challenges/177``` in your browser to verify the result in remote server. "177" is the challengeId which you must modify to match to the challenge your created. You will see a json reponse in return.
####Fail
You will see a console log in the browser console tool. For example:
	
	Fail to create a challenge:  { content: 'The resource is not found',
									result: { success: false, status: 404 } }

The error message is directly responsed from the remote server.

Then the url remain in ```http://localhost:8000/edit/#/new```.

### 2. Edit _"Information for Public Browsing Section"_
>All the following steps are described in the edit page after creating a draft challenge successfully or retrieving an existing challenge.

This section has 4 fields: Challenge Title, Overview, Description and Tags. And they will be initialized from the challenge entity.

Then the app will get the tag list. Currently this is implement directly by responsing the tags.json file. If you rename the data file, this call may fail.

**Success:** User can pick up tags from the typeahead multi-select input.

**Fail:** See a console log in the browser console tool. For Example:
	
	Fail to get tag list: { content: "ENOENT, open './client/edit-challenge/data/tags.json'",
							result: { status: 500, success: false } }
							
Fill all these four fields then the associated panel in the Challenge Map will turn green.

### 3. Edit _"Information for Registered Contestants"_

####Get all related files
Firstly, the app will get the related file list from server. If fail, a error log will generate to the console.

####Attach new files
In this section, user can browse and upload files and attach to the challenge.
Click the BROWSE button and pick up a file, fill the title input then hit the plus icon.
Now a file is being uploading. 
If no error occurs, the app will retrieve this new created file and add a card to the list which contains the detail information about this file. Otherwise, an error log will generate to the console and there will be no card added to the list.

In the server side, all files are uploaded to ```/server/upload``` directory.

####Delete existing files
User can delete a file by clicking the x icon in each file card. If success, the file card will be removed. Otherwise, an error log will generate to the console.

### 4. Edit _"Requirements"_

The app will load the associated requirements first.

User can add / edit / delete requirements in this section.

Any CURD errors will generate logs in console.

### 5. Edit _"Timeline"_ & _"Prizes"_

The app will load the value from the loaded challenge entity.
The customer accounts list is loaded from the server which just directly reponse the json file.

### 6. Save Challenge
According to the last comment in this [Forum thread](http://apps.topcoder.com/forums/?module=Thread&threadID=836944&start=0), the use could save the challenge at any time even all the panels in the Challenge Map are not in green.

If success, user will be navigate to ```http://localhost:8000/manage/#/challenges```. (According to this [forum thread](http://apps.topcoder.com/forums/?module=Thread&threadID=836946&start=0) )
If failure, a log will show up in the console.

### 7. Launch Challenge
According to the above forum post, only when all the section turn to green could the challenge be launched.

If lunch successfully, user will be navigate to ```http://localhost:8000/manage/#/challenges```. Just like the save action.
If failure, a log will show up in the console.

#Fixed Issues
###Fields issues
> There are some issues about the modle's fields.

1. When lunch a challenge, its status change from 'Active' to 'SUBMISSION'. (in client/edit-challenge/js/controllers/create-challenge-controller.js)
2. The text key in Requirement change from 'body' to 'requirementText' according to the remote api.(in client/edit-challenge/templates/requirement.html)
3. The prize change from an individual model to a key in the challenge model. (in client/edit-challenge/js/controllers/create-challenge-controller.js and client/edit-challenge/js/services/challenge-service.js)
4. File storage key change from 'storageType' to 'storageLocation'. (in server/routes/localUploadMiddleware.js)

###Interaction issues
> Some interaction in the page need a proper handler.

1. Multiple clicks when add a file.

	Originally, when a file is uploading, user can still hit the upload icon which will upload the same file many times. I prevent this multi-click confusion when a file is being uploaded.
	
2. Multiple clicks when add a requirement.
	
	Same problem as the above one.
	
3. Update the requirement in the frontend side when it really finished updation in the server side.

	Originally, if user edit a requirement and click the save icon. This requirement will update immediately no matter the server responses with success or failure. Now, only when the updating successfully and returned by the server, the requirement in the client side updates its value.
	
###File Upload issues
> Originally, the file upload dir is wrong and the upload function is not working too. Following is my enhancements.

1. Store the files into /server/upload directory. This can be modified in the future.
2. Make the upload progress bar working dynamically.
3. If user delete the files, these files won't be remove from the local directory. I think the requirement haven't asked this and the original code base haven't done this too. There will be many options to choose a location to store the file like aws, local etc. So it is no need to do this logic at this time.

#Manifest




