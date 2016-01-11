<% if(contentType==='characters'){ %>
function collectCharacterData (imagepath){
<% if(!newContent){ %>
	// collect attributes
	var attributes = "";
	<% for (var i=0; i<attributes.name.length; i++){ %>
	attributes += "<%= attributes.name[i] %>='"+$('#aForm').find('input[name="<%= attributes.name[i] %>"][type="checkbox"]:checked').length+"'<% if((i+1)<attributes.name.length){ %>,<% } %>";
	<% } %>
	// collect skills
	var skills = "";
	<% for (var i=0; i<skills.name.length; i++){ %>
	skills += "<%= skills.name[i] %>='"+$('#sForm').find('input[name="<%= skills.name[i] %>"][type="checkbox"]:checked').length+"'<% if((i+1)<skills.name.length){ %>,<% } %>";
	<% } %>
	// collect characteristics
	var advantages = "";
	<% for (var i=0; i<characteristics.advantages.name.length; i++){ %>
	if($('#cForm input[name="<%= characteristics.advantages.name[i] %>"]')[0].checked){
		advantages += "<%= characteristics.advantages.name[i] %>='1'";
	}
	else{
		advantages += "<%= characteristics.advantages.name[i] %>='0'";
	}
	<% if((i+1)<characteristics.advantages.name.length){ %>advantages += ",";<% } %>
	<% } %>
	var disadvantages = "";
	<% for (var i=0; i<characteristics.disadvantages.name.length; i++){ %>
	if($('#cForm input[name="<%= characteristics.disadvantages.name[i] %>"]')[0].checked){
		disadvantages += "<%= characteristics.disadvantages.name[i] %>='1'";
	}
	else{
		disadvantages += "<%= characteristics.disadvantages.name[i] %>='0'";
	}
	<% if((i+1)<characteristics.disadvantages.name.length){ %>disadvantages += ",";<% } %>
	<% } %>
	// collect character informations
	var iSerialized = $('#iForm').serializeArray();
	var informations = "";
	for(var i=0; i<iSerialized.length; i++){
		informations += iSerialized[i].name+"='"+iSerialized[i].value+"',";
	}
	informations += "cp='"+cp+"',";
	informations += "imagepath='"+imagepath+"'";
<% }else{ %>
	// collect attributes
	var attributes = "";
	<% for (var i=0; i<attributes.name.length; i++){ %>
	attributes += "'"+$('#aForm').find('input[name="<%= attributes.name[i] %>"][type="checkbox"]:checked').length+"'<% if((i+1)<attributes.name.length){ %>,<% } %>";
	<% } %>
	// collect skills
	var skills = "";
	<% for (var i=0; i<skills.name.length; i++){ %>
	skills += "'"+$('#sForm').find('input[name="<%= skills.name[i] %>"][type="checkbox"]:checked').length+"'<% if((i+1)<skills.name.length){ %>,<% } %>";
	<% } %>
	// collect characteristics
	var advantages = "";
	<% for (var i=0; i<characteristics.advantages.name.length; i++){ %>
	if($('#cForm input[name="<%= characteristics.advantages.name[i] %>"]').prop('checked')) advantages += "'1'<% if((i+1)<characteristics.advantages.name.length){ %>,<% } %>";
	else advantages += "'0'<% if((i+1)<characteristics.advantages.name.length){ %>,<% } %>";
	<% } %>
	var disadvantages = "";
	<% for (var i=0; i<characteristics.disadvantages.name.length; i++){ %>
	if($('#cForm input[name="<%= characteristics.disadvantages.name[i] %>"]').prop('checked')) disadvantages += "'1'<% if((i+1)<characteristics.disadvantages.name.length){ %>,<% } %>";
	else disadvantages += "'0'<% if((i+1)<characteristics.disadvantages.name.length){ %>,<% } %>";
	<% } %>
	// collect character informations
	var informations = "'"+$('#iForm [name="name"]').val()+"','"+$('#iForm [name="age"]').val()+"','"+$('#iForm [name="occupation"]').val()+
										"','"+$('#iForm [name="origin"]').val()+"','"+$('#iForm [name="description"]').val()+"','"+$('#iForm [name="startLevel"]').val()+"','"+$('#iForm [name="cp"]').val()+"','"+imagepath+"'";
<% } %>

	return {attributes:attributes, skills:skills, advantages:advantages, disadvantages:disadvantages, informations:informations};
}
<% } %>

<% if(contentType==='scenes'){ %>
function collectSceneData (imagepath){
<% if(!newContent){ %>
	var sceneData = "";

	sceneData += 'name="'+$('#<%= contentType %>Form input[name="name"]').val()+'",';

	$('#sceneDescription p').attr('contenteditable', false);
	var description = $('#<%= contentType %>Form #sceneDescription').html();
	description = description.replace(/"/g, '\\"');
	sceneData += 'description="'+description+'",';

	$('#keywordsScenes div h3').attr('contenteditable', false);
	$('#keywordsScenes div p').attr('contenteditable', false);
	var keywordsInfo = $('#keywordsScenes').html();
	// clean up keywords html for database
	keywordsInfo = keywordsInfo.replace(/<\/p><p>/g, '<br>');
	keywordsInfo = keywordsInfo.replace(/<\/p><p contenteditable="true">/g, '<br>');
	keywordsInfo = keywordsInfo.replace(/<\/p><p contenteditable="false">/g, '<br>');
	keywordsInfo = keywordsInfo.replace(/<\/p><\/p>/g, '<\/p>');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="true"><\/p>/g, '<p>');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="false"><\/p>/g, '<p>');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="true"><p/g, '<p');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="false"><p/g, '<p');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="true"><\/p><p/g, '<p');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="false"><\/p><p/g, '<p');
	keywordsInfo = keywordsInfo.replace(/"/g, '\\"');
	sceneData += 'keywordsInfo="'+keywordsInfo+'",';

	sceneData += 'category="'+$('[name="category"]').val()+'",';
	sceneData += 'imagepath="'+imagepath+'",';
	sceneData += 'soundpath=NULL';
<% }else{ %>
	var description = $('#<%= contentType %>Form #sceneDescription').html();
	description = description.replace(/"/g, '\\"');
	var keywordsInfo = $('#keywordsScenes').html();
	// clean up keywords html for database
	keywordsInfo = keywordsInfo.replace(/<\/p><p>/g, '<br>');
	keywordsInfo = keywordsInfo.replace(/<\/p><p contenteditable="true">/g, '<br>');
	keywordsInfo = keywordsInfo.replace(/<\/p><p contenteditable="false">/g, '<br>');
	keywordsInfo = keywordsInfo.replace(/<\/p><\/p>/g, '<\/p>');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="true"><\/p>/g, '<p>');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="false"><\/p>/g, '<p>');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="true"><p/g, '<p');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="false"><p/g, '<p');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="true"><\/p><p/g, '<p');
	keywordsInfo = keywordsInfo.replace(/<p contenteditable="false"><\/p><p/g, '<p');
	keywordsInfo = keywordsInfo.replace(/"/g, '\\"');

	var sceneData = "'"+$('#<%= contentType %>Form [name="name"]').val()+"','"+description+"','"+keywordsInfo+"','"+$('[name="category"]').val()+"','"+imagepath+"',NULL";
<% } %>

	return sceneData;
}
<% } %>

<% if(contentType==='enemies'){ %>
function collectEnemieData (imagepath){
	<% if(!newContent){ %>
	var serializedArray = $('#<%= contentType %>Form').serializeArray();
	var enemieData = "";
	for(var i=0; i<serializedArray.length; i++){
		enemieData += serializedArray[i].name+"='"+serializedArray[i].value+"',";
	}
	enemieData += 'imagepath="'+imagepath+'"';
	<% }else{ %>
	var enemieData = "'"+$('[name="name"]').val()+"', '"+$('[name="description"]').val()+"', '"+$('[name="category"]').val()+"', '"+imagepath+"'";
	<% } %>

	return enemieData;
}
<% } %>

<% if(contentType==='items'){ %>
function collectItemData (imagepath){
	<% if(!newContent){ %>
	var serializedArray = $('#<%= contentType %>Form').serializeArray();
	var itemData = "";
	for(var i=0; i<serializedArray.length; i++){
		itemData += serializedArray[i].name+"='"+serializedArray[i].value+"',";
	}
	itemData += 'imagepath="'+imagepath+'"';
	<% }else{ %>
	var itemData = "'"+$('[name="name"]').val()+"', '"+$('[name="description"]').val()+"', '"+$('[name="category"]').val()+"', '"+imagepath+"'";
	<% } %>

	return itemData;
}
<% } %>
