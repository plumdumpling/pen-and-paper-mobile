/* ADD AND REMOVE ATTRIBUTE POINTS */

// click on attribute checkbox
$('#aForm .checkbox').click(function (event) {
	var attrValue = $(this).prev().val();
	// check if clicked checkbox was checked or not
	if($(this).prev().prop('checked')){
		// remove attribute points, if an unchecked slot was clicked
		// how many attribute points should be removed
		var deductingAttr = ($(this).prev().parent().find('input[type=checkbox][name='+$(this).prev()[0].name+']:checked').length+1) - attrValue;
		// remove attribute points
		removeAttr($(this).prev()[0], deductingAttr);
	}
	else{
		// add attribute points, if a checked slot was clicked
		// how many attribute points should be added
		var additionalAttr = attrValue - $(this).prev().parent().find('input[type=checkbox][name='+$(this).prev()[0].name+']:checked').length;
		// add attribute points
		addAttr($(this).prev()[0], additionalAttr);
	}
});


// use "+"-button
function addAttr (sender, additionalAttr){
	// check if attribute already reached maximum
	if($('input[type=checkbox][name='+sender.name+']:checked').length >= 6) return false;

	// add as many attribute points as the value additionalAttr says
	for(var i=0; i<additionalAttr; i++){
		// check if an additional point for the attribute is affordable
		if(attrCosts(sender, true)){
			$('input[type=checkbox][name='+sender.name+']').each(function (){
				console.log($(this));
				// check the first not checked checkbox
				if(!$(this).prop('checked')){
					// check the checkbox
					$(this).prop('checked', true);

					if($(this).hasClass('disabled')){
						// enable the checkbox, if it was disabled
						$(this).removeClass('disabled');

						// disable an slot of the opposite attribute
						var group = $(sender).parent().attr('class').split(' ')[1];
						if($(sender).hasClass('a1')) removeAttrSlot(group, 'a2');
						else removeAttrSlot(group, 'a1');
					}
					return false;
				}
			});
		}
	}
}

// use "-"-button
function removeAttr (sender, deductingAttr){
	// check if attribute already reached minimum
	if($('input[type=checkbox][name='+sender.name+']:checked').length <= 0) return false;

	// remove as many attribute points as the value deductingAttr says
	for(var i=0; i<deductingAttr; i++){
		var checkbox = 1;
		$('input[type=checkbox][name='+sender.name+']').each(function (){
			// uncheck the last checked checkbox of the attribute
			if($(this).prop('checked') && !$(this).nextAll('input[type=checkbox]').eq(0).prop('checked')){
				// uncheck the checkbox
				$(this).prop('checked', false);

				// refund costs for removed attribute
				attrCosts($(this), false);

				// checked slots in attribute group
				var group = $(sender).parent().attr('class').split(' ')[1];
				var checkedSlots = $('.'+group).find('input[type="checkbox"]:checked').length;

				// disable the checkbox, so that at least 6 slots in group are enabled and up to 3 slots enabled per attribute
				if(!$(this).hasClass('disabled') && checkedSlots>=6 ||
					!$(this).hasClass('disabled') && checkbox>3){
					$(this).addClass('disabled');

					// enabled an slot of the opposite attribute, if there are less than 6 slots enabled in group
					if(checkedSlots<=5){
						if($(sender).hasClass('a1')) addAttrSlot(group, 'a2');
						else addAttrSlot(group, 'a1');
					}
				}
				return false;
			}
			checkbox++;
		});
	}
}

function addAttrSlot (group, classname){
	// checkboxes of the opposite attribute
	$('.'+group+' .'+classname+' input[type=checkbox]').each(function (){
		// enable the first disabled checkbox
		if($(this).hasClass('disabled')){
			$(this).removeClass('disabled');
			return false;
		}
	});
}

function removeAttrSlot (group, classname){
	// checkboxes of the opposite attribute
	$('.'+group+' .'+classname+' input[type=checkbox]').each(function (){
		// disable the last enabled checkbox, if it's not checked
		if(!$(this).prop('checked') && $(this).nextAll('input[type=checkbox]').eq(0).hasClass('disabled')){
			$(this).addClass('disabled');
			return false;
		}
	});
}


/* ADD AND REMOVE SKILL POINTS */

// click on skill checkbox
$('#sForm .checkbox').click(function (event) {
	var skillValue = $(this).prev().val();
	// check if clicked checkbox was checked or not
	if($(this).prev().prop('checked')){
		// remove skill points, if an unchecked slot was clicked
		// how many skill points should be removed
		var deductingSkill = ($(this).prev().parent().find('input[type=checkbox][name='+$(this).prev()[0].name+']:checked').length+1) - skillValue;
		// remove attribute points
		removeSkill($(this).prev()[0], deductingSkill);
	}
	else{
		// add skill points, if a checked slot was clicked
		// how many skill points should be added
		var additionalSkill = skillValue - $(this).prev().parent().find('input[type=checkbox][name='+$(this).prev()[0].name+']:checked').length;
		// add skill points
		addSkill($(this).prev()[0], additionalSkill);
	}
});

// use "+"-button
function addSkill (sender, additionalSkill){
	// check if skill already reached maximum
	if($('input[type=checkbox][name='+sender.name+']:checked').length >= 16) return false;

	// add as many skill points as the value additionalSkill says
	for(var i=0; i<additionalSkill; i++){
		// check if an additional point for the skill is affordable
		if(skillCosts(sender, true)){
			$('input[type=checkbox][name='+sender.name+']').each(function (){
				// check the first not checked checkbox
				if(!$(this).prop('checked')){
					// check the checkbox
					$(this).prop('checked', true);
					return false;
				}
			});
		}
	}

	// update parent element
	if($('input[type=checkbox][name='+sender.name+']:checked').length > 0){
		$('input[type=checkbox][name='+sender.name+']').parent().addClass('checked');
	}
}

// use "-"-button
function removeSkill (sender, deductingSkill){
	// check if skill already reached minimum
	if($('input[type=checkbox][name='+sender.name+']:checked').length <= 0) return false;

	// remove as many skill points as the value deductingSkill says
	for(var i=0; i<deductingSkill; i++){
		$('input[type=checkbox][name='+sender.name+']').each(function (){
			// uncheck the last checked checkbox of the skill
			if($(this).prop('checked') && !$(this).nextAll('input[type=checkbox]').eq(0).prop('checked')){
				// uncheck the checkbox
				$(this).prop('checked', false);
				// refund costs for removed skill point
				skillCosts($(this), false);
				return false;
			}
		});
	}

	// update parent element
	if($('input[type=checkbox][name='+sender.name+']:checked').length <= 0){
		$('input[type=checkbox][name='+sender.name+']').parent().removeClass('checked');
	}
}


/* ADD AND REMOVE CHARACTERISTICS */
// advantages
$('#cForm .advantages p .checkbox').click(function (event){
	if($(this).prev().prop('checked')) removeAdvantage($(this).prev());
	else addAdvantage($(this).prev());
});

function addAdvantage (sender){
	// check if advantage is affordable
	if(!advantageCosts(sender, true)){
		// uncheck clicked checkbox
		$(sender).prop('checked', false);
		$(sender).parent().removeClass('checked');
	}
	else{
		$(sender).prop('checked', true);
		$(sender).parent().addClass('checked');
	}
}

function removeAdvantage (sender){
	$(sender).prop('checked', false);
	$(sender).parent().removeClass('checked');
	// refund costs for removed advantage
	advantageCosts(sender, false);
}

// disadvantages
$('#cForm .disadvantages p .checkbox').click(function (event){
	if($(this).prev().prop('checked')) removeDisadvantage($(this).prev());
	else addDisadvantage($(this).prev());
});


function addDisadvantage (sender){
	$(sender).prop('checked', true);
	$(sender).parent().addClass('checked');
	// refund costs for added disadvantage
	disadvantageCosts(sender, true);
}

function removeDisadvantage (sender){
	// check if removing the disadvantage is affordable
	if(!disadvantageCosts(sender, false)){
		// let clicked checkbox be checked
		$(sender).prop('checked', true);
		$(sender).parent().addClass('checked');
	}
	else{
		$(sender).prop('checked', false);
		$(sender).parent().removeClass('checked');
	}
}


/* HANDLE COSTS */

function attrCosts (sender, addAttr){
	// checked slots in attribute group
	var group = $(sender).parent().attr('class').split(' ')[1];
	var checkedSlots = $('.'+group).find('input[type=checkbox]:checked').length;
	// reset costs
	var costs = 0;

	// check attribute point for its costs
	if(checkedSlots>=6){
		// higher costs for all attribute > 6 in group
		if(addAttr) costs -= (checkedSlots-4)*2;
		else costs += (checkedSlots-4)*2;
	}
	// default costs for an attribute point = 2 cp
	else{
		if(addAttr) costs-=2;
		else costs+=2;
	}

	return isAffordable(costs);
}

function skillCosts (sender, addSkill){
	// reset costs
	var costs = 0;

	// costs for an skill point = 1 cp
	if(addSkill) costs--;
	else costs++;

	return isAffordable(costs);
}

function advantageCosts (sender, addAdvan){
	// reset costs
	var costs = 0;

	// get costs for advantage
	var costValue = $(sender).attr('data-costs');

	if(addAdvan) costs-=parseInt(costValue);
	else costs+=parseInt(costValue);

	console.log('advantage costs '+costs);

	return isAffordable(costs);
}

function disadvantageCosts (sender, addDisadvan){
	// reset costs
	var costs = 0;

	// get costs for disadvantage
	var costValue = $(sender).attr('data-costs');

	if(addDisadvan) costs+=parseInt(costValue);
	else costs-=parseInt(costValue);

	console.log('disadvantage costs '+costs);

	return isAffordable(costs);
}

function isAffordable (costs){
	// is affordable
	if((cp+costs)>=0){
		// calculate and show new cp value
		cp+=costs;
		document.getElementById('cpCounter').innerHTML = cp;
	  $('#iForm input[name=cp]').val(cp);
		return true;
	}
	// is unaffordable
	else return false;
}
