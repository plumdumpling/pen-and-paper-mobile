var tippsGM = ["Willkommen im Abenteuer! Hier oben links siehst du die aktuelle Szene und vorherige Orte an denen das Abenteuer gespielt hat. Bunt markierte Worte besitzen noch mehr Informationen. Klick sie doch mal an!",
  "Am rechten Bildschirmrand sind verschiedene Knöpfe angebracht. Im obersten findest du Einstellungen. Dort kannst du das Tutorial ausschalten, das Abenteuer beenden oder Mitspieler die die Verbindung verloren haben mit dem Verbindungscode wieder ins Spiel lassen.",
  "Der Button unterhalb der Einstellungen öffnet das Szenenmenü. Dort kannst du eine neue Szene wählen, die dann unterhalb der aktuellen angezeigt wird.",
  "Du kannst bei Szenen, Gegnern und Gegnständen zwischen Inhalten aus der Datenbank und selbst erstellten Inhalten wählen. Klicke dazu das Symbol rechts neben der Kategoriewahl.",
  "Im nächsten Menü kannst du Gegner für einen Kampf aussuchen, mit Werten ausstatten und an Spieler senden. Versuch es doch mal!",
  "Hat ein Spieler für einen Angriff erfolgreich gewürfelt, dann darf er den Gegner verletzen. Ziehe den Spieler dafür per Drag-and-Drop auf den Gegner und sieh was passiert.",
  "Das ganze funktioniert auch anders herum. Wenn ein Gegner einen Spieler angreifen soll, dann ziehe diesen per Drag-and-Drop auf den Spieler und würfel für ihn.",
  "So können Spieler Schaden erleiden, doch du kannst sie wieder heilen, weiter verletzen, die geistige Konstitution des Spielercharakters verändern und den Spieler mit Charakterpunkten für gute Aktionen belohnen. Klicke dafür auf einen Spieler.",
  "Damit die Spieler ordentlich looten können musst du ihnen Gegenstände geben. Das kannst du über das vorletzte Menü am rechten Bildschirmrand machen.",
  "Immer wenn ein Spielercharakter eine Aktion machen möchte, die Können erfordert, dann muss er auf die Fertigkeit würfeln, die am ehesten zu der Aktion passt.",
  "Fragen die Spieler dich zum Beispiel was sie sehen und hören, kannst du sie auch auf Attribute wie in diesem Fall Intuition würfeln lassen.",
  "Doch nicht nur Würfelproben können absolviert werden. Hinter dem letzten Menüpunkt verbergen sich Minispiele, die für bestimmte Situationen sicher passend sind. Probier sie bei Gelegenheit doch mal aus.",
  "Damit kennst du nun die wichtigsten Funktionen der Oberfläche. Führe die Spieler durch deine Welt. Viel Spaß bei deinem Pen-and-Paper-Abenteuer!"];

var tippsP = ["Willkommen im Abenteuer! Hier siehst du nun deinen Charakter. Sieht gut aus! Informationen zu Gesundheit und geistiger Konstitution findest du am unteren Bildschirmrand.",
  "Am rechten Bildschirmrand sind verschiedene Knöpfe angebracht. Im obersten findest du Einstellungen. Dort kannst du das Tutorial ausschalten, das Abenteuer beenden oder Mitspieler die die Verbindung verloren haben mit dem Verbindungscode wieder ins Spiel lassen.",
  "Im Menüpunkt unterhalb der Einstellungen findest du das Inventar deines Charakters. Dort kannst du später Gegenstände per Drag-and-Drop ein- und aussortieren.",
  "Der nächste Button öffnet deinen Charakterbogen. Dort kannst du deine Werte einsehen und über einen Bearbeiten-Button in der rechten oberen Ecke verändern.",
  "Immer wenn du eine Aktion machen möchtest, die Können erfordert, musst du auf die Fertigkeit oder das Attribut würfeln, das am ehesten zu der Aktion passt. Der Spielleiter hilft dir dabei zu entscheiden welche dies ist. Um zu Würfeln öffne den letzten Menüpunkt und wähle die entsprechende Prüfung.",
  "Damit kennst du nun die wichtigsten Funktionen der Oberfläche. Erlebe eine Welt voller Überraschungen. Viel Spaß bei deinem Pen-and-Paper-Abenteuer!"];

var tutorialStep = 0;
var tutInterval;
var stopped = false;

function startTutorialNow (){
  tutorialStep = 0;
  startTutorial();
}

function startTutorial (){
  // show an info every 10 seconds after the last one was read
  tutInterval = setInterval(function (){
    if(!stopped){
      if($('body').hasClass('gamemaster')){
        if(tippsGM.length > tutorialStep) tutorialNotification(tippsGM[tutorialStep]);
        else stopTutorial();
      }
      else if($('body').hasClass('player')){
        tutorialNotification(tippsP[tutorialStep]);
      }
      tutorialStep++;
    }
    else{
      stopTutorial();
    }
  }, 10000);
}

function stopTutorial (){
  stopped = true;
  clearInterval(tutInterval);
}


/* NOTIFICATIONS */
var counter = 0;
function tutorialNotification (text){
	// create notification div
	var div = document.createElement('div');
	div.className = 'notification';
  // get an id for the notification
	var thisID = 'no'+counter;
	counter++;
	div.id = thisID;
	// fill notification with text
	div.innerHTML = '<p>'+text+'</p><a class="close" onClick="closeTutNotification(this);"></a>';
	$('#notifications').append(div);

	// show notification
	$('#'+thisID).addClass('visible');

  // wait with next steps
  clearInterval(tutInterval);
}

function closeTutNotification (sender){
  // ready for next tutorial step
  startTutorial();

	$('#'+$(sender).parent().attr('id')).removeClass('visible');
	setTimeout(function (){
		// animate div to height 0 to close the gap
		$('#'+$(sender).parent().attr('id')).css('height', $('#'+$(sender).parent().attr('id')).height());
		$('#'+$(sender).parent().attr('id')).css('min-height', '0');
		$('#'+$(sender).parent().attr('id')).css('padding', '0');
		$('#'+$(sender).parent().attr('id')).animate({height: '0'}, 200, function(){
			$('#'+$(sender).parent().attr('id')).remove();
		});
	}, 1000);
}
