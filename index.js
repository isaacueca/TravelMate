/*	Copyright (C) 2010-2011 Mike Hardaker for Jag.gr.
 
		This file is part of TravelMate.

    TravelMate is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    TravelMate is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with TravelMate.  If not, see <http://www.gnu.org/licenses/>.
*/
function DST(){
	 var gmt = new Date;
	 var lsm = new Date;
	 var lso = new Date;
	 lsm.setMonth(2); // March
	 lsm.setDate(31);
	 var day = lsm.getDay();// day of week of 31st
	 lsm.setDate(31-day); // last Sunday
	 lso.setMonth(9); // October
	 lso.setDate(31);
	 day = lso.getDay();
	 lso.setDate(31-day);
	 if (gmt > lsm || gmt <= lso) {return true;} else {return false;}
}
function appActive() {
	getFreshForexData = 0;
	dd2 = new Date();
	dTI = 1440;
	dTI2 = 0;
	dUTC2 = parseInt(Date.parse(dd2.toUTCString())/60000);
	forexDataSaved2 = parseInt(localStorage.forexDataSaved);
	if (dd2.getUTCDay() == 6){
		dTI2 = ((dd2.getUTCHours()*60)+720);
	} 
	if (dd2.getUTCDay() == 0){
		dTI = 2880;
		dTI2 = ((dd2.getUTCHours()*60)+2160);
	}
	if (dd2.getUTCDay() == 1){
	  dTI2 = ((dd2.getUTCHours()*60)+3600);
	}
	if (dTI2 > dTI){dTI = dTI2;}
	var isDst = DST();
			//ECB says data is updated 15:00 CET - but it's 15:00 CEST in summer...
	if (isDst) {dTI = dTI - 60;}
	if ((dUTC2 - forexDataSaved2) > dTI){getFreshForexData = 1;}
	if (isNaN(dUTC2 - forexDataSaved2)){getFreshForexData = 1;}
	/*if (getFreshForexData == 1) {
		setForexData();
	}*/
  return getFreshForexData;
}
function checkTimeZone() {
   var rightNow = new Date();
   var date1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);
   var date2 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0);
   var temp = date1.toGMTString();
   var date3 = new Date(temp.substring(0, temp.lastIndexOf(" ")));
   var temp = date2.toGMTString();
   var date4 = new Date(temp.substring(0, temp.lastIndexOf(" ")));
   var hoursDiffStdTime = (date1 - date3) / (1000 * 60 * 60);
   var hoursDiffDaylightTime = (date2 - date4) / (1000 * 60 * 60);
   if (hoursDiffDaylightTime == hoursDiffStdTime) { 
      return false;
   } else {
      return true;
   }
}
var myApiUrl = 'http://YOUR_API_URL_GOES_HERE';
var isOnline = navigator.onLine;
var tmIcon = 'travelmate-ati.png';
var tmPss = 'travelmate-ps.png';
var tmTss = 'travelmate-ts.png';
if (((window.devicePixelRatio) && (window.devicePixelRatio > 1))|Ext.is.iPad) {
	tmIcon = 'travelmate-ati@2x.png';
}
if (!Ext.is.iOS) {
  Ext.Anim.override({
    disableAnimations:true
  });
}
Ext.setup(
	{
	statusBarStyle: 'black',
  icon: tmIcon,
	tabletStartupScreen: tmTss,
	phoneStartupScreen: tmPss,
	glossOnIcon: false,
	onReady: function () {
		var i;
		var db = openDatabase('travelmate_db', '1', 'TravelMate DB', 65536);
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS Favorites(f_ctype REAL, f_to_value TEXT, f_from_value TEXT, f_to_key TEXT, f_from_key TEXT, f_datetime TEXT);');
    });
		for (i=1; i<=3; i++){
			var imageObj = new Image();
			imageObj.src = 'more'+i+'.png'
		}
    if ((Ext.is.iOS) && !Ext.is.Standalone){
			var pMargin, pHTML;
			if (Ext.is.Tablet) {
				pMargin = '65 0 0 69';
				pHTML = '<div>This web app is designed to be run Full Screen, just like an application from the App Store.<br/><br/>' +
					'To install it on your iPad, just tap the right-hand icon above and then <strong>Add to Home Screen.</strong></div>' +
					'<div><img src="down-arrow.png" style="-webkit-transform:rotate(180deg);width:150px;height:75px;position:absolute; top:-125px;left: 42px;clear:all"></div>';
			} else {
				pMargin = '100 18 0 18';
				pHTML = '<div>This web app is designed to be run Full Screen, just like an application from the App Store.<br/><br/>' +
					'To install it on your device, just tap the central icon below and then <strong>Add to Home Screen.</strong></div>' +
					'<div><img src="down-arrow.png" style="width:150px;height:75px;position:absolute; top:170px;left: 42px;clear:all"></div>';
			}
			if (!this.instPopup) {
			this.instPopup = new Ext.Panel({
				id: 'instPopup',
				floating: true,
				modal: true,
				centered: false,
				margin : pMargin,
				hideOnMaskTap: false,
				styleHtmlContent: true,
				dockedItems: [{
					dock: 'top',
					xtype: 'toolbar',
					title: 'Installation',
					height: 40
				}],
				items: [{
					html: pHTML
				}]
			});
		}
		this.instPopup.show('pop');
	}
	else if (Ext.is.Desktop){
		window.location.href='about.html';
	}
	else {
		// Introductory stuff
		var cF = localStorage.currencyFrom,
			cT = localStorage.currencyTo,
			lF = localStorage.languageFrom,
			lT = localStorage.languageTo,
			curToConv = localStorage.curToConvert,
			txtToTrans = localStorage.txtToTranslate,
			aC = parseInt(localStorage.activeCard,10),
			amtToConvert = 0,
			forexDone = 0,
			forexDate = '',
			card0Init = 0;
		if(!cF) {cF='USD';}
		if(!cT) {cT='EUR';}
		if(!lF) {lF='en';}
		if(!lT) {lT='fr';}
		if(!curToConv){curToConv='0';}
		if(!txtToTrans){txtToTrans='';}
		if(!aC) {aC=0;}
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g,'');
		};
		String.prototype.addCommas = function() {
			nStr = this +'';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}
		// Models
		Ext.regModel('Language', {
				fields: ['value', 'text']
		 });
		Ext.regModel('Currency', {
				fields: ['value', 'text']
		 });
		Ext.regModel('Forex', {
				fields: ['key', 'value'],
				reader: {
					type: 'json'
				}
		 });
setForexData = function() {
		if (!myLoadMask){var myLoadMask = new Ext.LoadMask(Ext.getBody(), {msg:"Updating exchange rates..."});}
		myLoadMask.show();
		if(navigator.onLine){
			Ext.util.JSONP.request({
				url: myApiUrl,
				callbackKey: 'callback',
				params: {noCache: Math.random()},
				callback: function(data) {
					forexData = data.results;
					Ext.StoreMgr.get('storeForex').remove('Forex');
					fi = localStorage.getItem('forexProxy');
					if (fi) {
						fiArr = new Array();
						fiArr = fi.split(',');
						if (fiArr.length) {
							for (i=0;i<=((fiArr.length)-1); i++){
								localStorage.removeItem('forexProxy-'+fiArr[i]);
							}
							localStorage.removeItem('forexProxy-undefined');
							localStorage.removeItem('forexProxy-counter');
							localStorage.removeItem('forexProxy');
							localStorage.removeItem('forexDataSaved');
						}
					} else
					{
						myLoadMask.hide();
					}
					Ext.StoreMgr.get('storeForex').loadData(forexData)
					Ext.StoreMgr.get('storeForex').sync();
					dUTC3 = (parseInt(Date.parse(storeForex.findRecord('key','date').data.value)/60000))+960;
					localStorage.setItem('forexDataSaved', dUTC3);
					myLoadMask.hide();
				}
			});
		} else {
			myLoadMask.hide();
			navigator.notification.alert('Using cached exchange rate data, from ' + storeForex.findRecord('key','date').data.value, Ext.emptyFn, 'Offline!','OK');					
		}
	};
  // Event handlers
		var changeTxtToTrans = function () {
			var srcText = document.getElementById("i").value.trim();
			if (srcText) {
				clearBtn.show();
				saveTrans.show();
				google.language.translate(srcText + ' ', lF, lT, function (result) {
					if (!result.error) {
						txtTranslated.removeAll();
						txtTranslated.update(result.translation.trim());
						if (txtTranslated.getSize() > 0) {saveTrans.show();}
					}
				});
			}
			else {
				clearBtn.setVisible(false);
				saveTrans.setVisible(false);
				txtTranslated.update('');
			}
			localStorage.setItem('txtToTranslate', srcText);
		};
		var setLanguage = function() {
			recF = storeLanguage.findRecord('value',lF);
			recT = storeLanguage.findRecord('value',lT);
			lF2 = recF.data.text;
			lT2 = recT.data.text;
			var langTxt = lF2+' to<br/>'+lT2;
			Ext.getCmp('currentLangs').update(langTxt);
		};
		var changeLanguage = function() {
				oldlF = lF;
				oldlT = lT;
				lF = this.getValue().languageFrom;
				lT = this.getValue().languageTo;
				if (oldlF != lF || oldlT != lT){
					recF = storeLanguage.findRecord('value',lF);
					recT = storeLanguage.findRecord('value',lT);
					lF2 = recF.data.text;
					lT2 = recT.data.text;
					var langTxt = lF2+' to<br/>'+lT2;
					Ext.getCmp('currentLangs').update(langTxt);
					if (oldlF != lF){
						document.getElementById("i").value = '';
						clearBtn.setVisible(false);
					} else {
						document.getElementById("i").focus();
					}
					localStorage.setItem('languageFrom', lF);
					localStorage.setItem('languageTo', lT);
					document.getElementById("i").blur();
				}
			};
			var saveTranslation = function() {
				inText = document.getElementById('i').value.trim();
				outText = document.getElementById('txTr').innerText.trim();
				timeNow = new Date();
				strSQL = 'SELECT rowid FROM Favorites ' +
					'WHERE f_to_value ="' + outText + '" AND f_from_value = "' + inText + '" ' +
					'AND f_to_key = "' + lT + '" AND f_from_key = "' + lF + '" AND f_ctype = 1;';
				db.transaction(function(tx) {
					tx.executeSql(strSQL, [], function(tx, result) {
						if (result.rows.length){
							thisRowId = result.rows.item(0)['rowid'];
							db.transaction(function(tx) {
								tx.executeSql('UPDATE Favorites SET f_datetime = ? WHERE rowid = ?',[timeNow, thisRowId]);
							});
						} else {
							db.transaction(function(tx) {
								tx.executeSql('INSERT INTO Favorites (f_ctype, f_to_value, f_from_value, f_to_key, f_from_key, f_datetime) ' +
										'VALUES (?,?,?,?,?,?)', ["1", outText, inText,lT,lF,timeNow]);
							});
						}
					});
				});
				document.getElementById('i').blur();
				Ext.Msg.show({title:'Saved Items',
					msg:'This translation is saved in your database',
					fn: Ext.emptyFn,
					buttons: Ext.MessageBox.OK,
					baseCls: 'x-msgbox'
				});
			};
			var convertCurrency = function() {
		amtToConvert = parseFloat(localStorage.curToConvert);
		if (amtToConvert > 0) {
		forexDate = storeForex.findRecord('key','date').data.value;
		if(cF == 'OMR'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)/2.6008)
		} else if(cF == 'ERN'){
	 		forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*16.5)
		} else if(cF == 'LBP'){
	 		forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*1507.5)
		} else if(cF == 'QAR'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*3.64)
		} else if(cF == 'MVR'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*12.8)
		} else if(cF == 'AED'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*3.6725)
		} else if(cF == 'SAR'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*3.75)
		} else if(cF == 'JOD'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*0.709)
		} else if(cF == 'AWG'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*1.79)
		} else if(cF == 'BBD' || cF == 'BZD'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*2)
		} else if(cF == 'BSD'){
			forexFrom = parseFloat(storeForex.findRecord('key','USD').data.value)
		} else if(cF == 'XCD'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*2.7)
		} else if(cF == 'VEF'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*4.3)
		} else if(cF == 'DJF'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*177.721)
		} else if(cF == 'KYD'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)/1.2346)
		} else if(cF == 'BHD'){
			forexFrom = parseFloat((storeForex.findRecord('key','USD').data.value)*0.376)
		} else {
			forexFrom = parseFloat(storeForex.findRecord('key',cF).data.value);
		}
	 if(cT == 'OMR'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)/2.6008)
	 } else if(cT == 'ERN'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*16.5)
	 } else if(cT == 'LBP'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*1507.5)
	 } else if(cT == 'QAR'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*3.64)
	 } else if(cT == 'MVR'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*12.8)
	 } else if(cT == 'AED'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*3.6725)
	 } else if(cT == 'SAR'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*3.75)
	 } else if(cT == 'JOD'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*0.709)
	 } else if(cT == 'AWG'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*1.79)
	 } else if(cT == 'BBD' || cT == 'BZD'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*2)
	 } else if(cT == 'BSD'){
	 	forexTo = parseFloat(storeForex.findRecord('key','USD').data.value)
	 } else if(cT == 'XCD'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*2.7)
	 } else if(cT == 'VEF'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*4.3)
	 } else if(cT == 'DJF'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*177.721)
	 } else if(cT == 'KYD'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)/1.2346)
	 } else if(cT == 'BHD'){
	 	forexTo = parseFloat((storeForex.findRecord('key','USD').data.value)*0.376)
	 } else {
	 	forexTo = parseFloat(storeForex.findRecord('key',cT).data.value);
	 }
		forexDone = (amtToConvert/forexFrom)*forexTo;
					if (cF == 'JPN'){cDF = 0;} else {cDF = 2;}
					if (cT == 'JPN'){cDT = 0;} else {cDT = 2;}
					amtToConvert = amtToConvert.toFixed(cDF).addCommas();
					forexDone = forexDone.toFixed(cDT).addCommas();
					curHtml = '<div class="curResult">'+cF+' '+amtToConvert+'<br />'+cT+' '+forexDone+'</div><div class="curDisclaimer">' +
						'ECB rates updated '+forexDate+', 15:00 CET';
					Ext.getBody().mask(false, '<div class="behind-results"></div>');
					if (!curSubmit.popup) {
						curSubmit.popup = new Ext.Panel({
							id: 'popup',
							name: 'popup',
							floating: true,
							modal: true,
							centered: true,
							width: 300,
							styleHtmlContent: true,
							html: curHtml,
							dockedItems: [{
								dock: 'top',
								xtype: 'toolbar',
								title: 'Conversion',
								items: [saveCur]
							}],
							scroll: 'vertical'
						});
					} else {
						curSubmit.popup.update(curHtml);
					}
					curSubmit.popup.show('pop');
				}
			};
			var setCurrency = function() {
				recF = storeCurrency.findRecord('value',cF);
				recT = storeCurrency.findRecord('value',cT);
				cF2 = recF.data.text;
				cT2 = recT.data.text;
				var curTxt = cF2+' to<br/>'+cT2;
				Ext.getCmp('currentCurs').update(curTxt);
			};
			var changeCurrency = function() {
				cF = this.getValue().currencyFrom;
				cT = this.getValue().currencyTo;
				recF = storeCurrency.findRecord('value',cF);
				recT = storeCurrency.findRecord('value',cT);
				cF2 = recF.data.text;
				cT2 = recT.data.text;
				var curTxt = cF2+' to<br/>'+cT2;
				Ext.getCmp('currentCurs').update(curTxt);
				localStorage.setItem('currencyFrom', cF);
				localStorage.setItem('currencyTo', cT);
			};
			var saveCurrency = function() {
				Ext.getCmp('popup').hide();
				inText = amtToConvert;
				outText = forexDone;
				timeNow = forexDate;
				strSQL = 'SELECT rowid FROM Favorites ' +
					'WHERE f_to_value ="' + outText + '" AND f_from_value = "' + inText + '" ' +
					'AND f_to_key = "' + cT + '" AND f_from_key = "' + cF + '" AND f_ctype = 2 AND f_datetime = "'+ forexDate + '";';
				db.transaction(function(tx) {
					tx.executeSql(strSQL, [], function(tx, result) {
						if (!result.rows.length){
							db.transaction(function(tx) {
								tx.executeSql('INSERT INTO Favorites (f_ctype, f_to_value, f_from_value, f_to_key, f_from_key, f_datetime) ' +
										'VALUES (?,?,?,?,?,?)', ["2", outText, inText,cT,cF,timeNow]);
							});
						}
					});
				});
				Ext.Msg.show({title:'Saved Items',
					msg:'This conversion is saved in your database',
					fn: Ext.emptyFn,
					buttons: Ext.MessageBox.OK,
					baseCls: 'x-msgbox'
				});
			};
			var pressNk = function() {
				var nkValue = this.getText();
				if (nkValue == 'C') {
					nkr0.update('0');
					localStorage.setItem('curToConvert', '');
					if (Ext.is.Phone) {nk2r0.update('0');}
				} else {
					var nkDisplayValue = localStorage.curToConvert;
					if (!nkDisplayValue){nkDisplayValue = '';}
					if (nkValue == '.'){
						if (nkDisplayValue.indexOf('.') != -1) {nkValue = '';}
						if (isNaN(parseFloat(nkDisplayValue))){nkValue = '0.';}
						nkDisplayValue = nkDisplayValue + nkValue;
					}
					else {
						if (nkValue) {
							if (nkDisplayValue.indexOf('.') != -1){
								if (nkValue == '0') {
									nkDisplayValue = nkDisplayValue + nkValue;
								} else {
									nkDisplayValue = parseFloat((nkDisplayValue + nkValue));
									if (isNaN(nkDisplayValue)){newCurVal = 0;}
								}
							} else {
								nkDisplayValue = parseFloat((nkDisplayValue + nkValue));
								if (isNaN(nkDisplayValue)){newCurVal = 0;}
							}
						}
					}
					nkr0.update(nkDisplayValue+'');
					if (Ext.is.Phone) {nk2r0.update(nkDisplayValue+'');}
					localStorage.setItem('curToConvert', nkDisplayValue);
				}
				if (Ext.is.Phone) {
					if (tabpanel.getWidth() > tabpanel.getHeight()){
						nk.hide();
					}
					else{
						nk2.hide();
					}
				}
			};
			var getSavedItems = function() {
				var myHtml = '';
				var myHtml2 = '';
				db.transaction(function(tx) {
						tx.executeSql("SELECT rowid, f_ctype, f_to_value, f_from_value, f_to_key, f_from_key, f_datetime FROM Favorites ORDER BY rowid DESC", [], function(tx, result) {
								for (i = 0; i < result.rows.length; ++i) {
										var row = result.rows.item(i);
										fRowId = row['rowid'];
										fCType = row['f_ctype'];
										fToVal = row['f_to_value'];
										fFromVal = row['f_from_value'];
										fToKey = row['f_to_key'];
										fFromKey = row['f_from_key'];
										fDateTime = row['f_datetime'];
										if (fCType == 1){
											fFromKey2 = storeLanguage.findRecord('value',fFromKey);
											fToKey2 = storeLanguage.findRecord('value',fToKey);
											fToKeyL = fToKey2.data.text;
											fFromKeyL = fFromKey2.data.text;
											myHtml = myHtml + '<div class="savedItem" id="item_'+fRowId+'">' +
												'<div class="delSavedItem" id="rowid_'+fRowId+'">' +
												'</div><div class="savedKey">'+fFromKeyL+':</div>' +
												'<div class="savedFromValue">'+fFromVal+'</div><div class="savedKey">'+fToKeyL+':</div>' +
												'<div class="savedToValue">'+fToVal+'</div><div class="savedDateTime">'+fDateTime+'</div></div>';
										} else if (fCType == 2){
											fFromKey2 = storeCurrency.findRecord('value',fFromKey);
											fToKey2 = storeCurrency.findRecord('value',fToKey);
											fToKeyL = fToKey2.data.text;
											fFromKeyL = fFromKey2.data.text;
											myHtml2 = myHtml2 + '<div class="savedItem" id="item_'+fRowId+'">' +
												'<div class="delSavedItem" id="rowid_'+fRowId+'">' +
												'</div><div class="savedKey">'+fFromKeyL+' to '+fToKeyL+'</div>' +
												'<div class="savedToValue">'+fFromKey+' '+fFromVal+' = '+fToKey+' '+fToVal+'</div>' +
												'<div class="savedDateTime">ECB rates updated '+fDateTime+' 15:00 CET</div></div>';
										}
								}
								if (!myHtml.length) {
										myHtml = '<div>There are currently no saved translations in the database</div>';}
								if (!myHtml2.length) {
										myHtml2 = '<div>There are currently no saved currency conversions in the database</div>';}
								myHtml = '<h3>Translations:</h3>' + myHtml;
								myHtml2 = '<h3>Currency conversions:</h3>' + myHtml2;
								savedContainer.removeAll();
								savedContainer.update(myHtml);
								savedContainer2.removeAll();
								savedContainer2.update(myHtml2);
								var elArray = document.body.getElementsByClassName('delSavedItem');
									for ( i=0, len=elArray.length; i<len; ++i ){
										el = elArray[i];
										el.addEventListener('click', delSavedItem, this);
									}
						});
				});
			};
			var delSavedItem = function(){
				fRowId = this.id.replace('rowid_','');
					tabpanel.actionsh = new Ext.ActionSheet({
						id: 'delCancel',
						items: [{
								xtype: 'container',
								html: '<div class="delConfirm">Are you sure you want to delete this saved item?'
						},{
								text: 'Delete Item',
								ui: 'decline',
								cls: 'deleteBtn',
								handler: function() {
									db.transaction(function(tx) {
										tx.executeSql('DELETE FROM Favorites WHERE rowid = ?',[fRowId]);
									});
									tabpanel.actionsh.destroy();
									getSavedItems();
								}
							},{
								text: 'Cancel',
								cls: 'cancelBtn',
								handler: function() {
									tabpanel.actionsh.destroy();
								}
							}]
					});
				tabpanel.actionsh.show();
			};
			var setCard0 = function() {
				localStorage.setItem('activeCard', 0);
				navigationBar.setTitle('<img src="travelmate-nb.png" class="navBarLogo"> Translate');
				if (card0Init === 0) {
					var c = document.getElementById('c');
					var i = document.getElementById('i');
					c.addEventListener('touchstart', function (p) {clearBtn.setVisible(false);saveTrans.setVisible(false);txtTranslated.update('');localStorage.setItem('txtToTranslate', '');i.value = "";i.focus();p && p.preventDefault();}, this);
					c.addEventListener('mousedown', function (p) {clearBtn.setVisible(false);saveTrans.setVisible(false);txtTranslated.update('');localStorage.setItem('txtToTranslate', '');i.value = "";i.focus();p && p.preventDefault();}, this);
					i.addEventListener('keyup', changeTxtToTrans, this);
					i.addEventListener('change', changeTxtToTrans, this);
					i.addEventListener('focus', changeTxtToTrans, this);
					i.addEventListener('blur', function(){changeTxtToTrans;clearBtn.setVisible(false);}, this);
					if (i.value.trim()){
						google.language.translate(i.value.trim() + ' ', lF, lT, function (result) {
							if (!result.error) {
								txtTranslated.removeAll();
								txtTranslated.update(result.translation);
								saveTrans.setVisible(true);
							}
						});
					}
					card0Init = true;
				} else {
					var t = document.getElementById('txTr').innerText.trim();
					if (t) {
						saveTrans.setVisible(true);
					}
				}
			};
			var setCard1 = function() {
				saveTrans.hide();
				localStorage.setItem('activeCard', 1);
				navigationBar.setTitle('<img src="travelmate-nb.png" class="navBarLogo"> Currency');
			};
			var setCard2 = function() {
				saveTrans.hide();
				localStorage.setItem('activeCard', 2);
				navigationBar.setTitle('<img src="travelmate-nb.png" class="navBarLogo"> Saved Items');
				getSavedItems();
			};
			var setCard3 = function() {
				saveTrans.hide();
				localStorage.setItem('activeCard', 3);
				navigationBar.setTitle('<img src="travelmate-nb.png" class="navBarLogo">');
			};
		// Objects
			// Translation
			var clearBtn = new Ext.Container({
				id: 'c',
				cls: 'clearBtn',
				hidden: true
			});
			var txtTranslated = new Ext.Container({
				id: 'txTr',
				cls: 'txTr',
				scroll: 'vertical'
			 });
			var translateField = new Ext.Component({
					initComponent: function() {
					this.constructor.prototype.initComponent.apply(this, arguments);
					this.el = document.createElement('input');
					this.el.type = 'text';
					this.el.id = 'i';
					this.el.className = 'x-input-text';
					this.el.placeholder = 'Text to translate...';
					this.el.autocapitalize = false;
					this.el.value = txtToTrans;
				}
			});
			var txtToTranslate = new Ext.Container({
				cls: 'x-field x-field-text',
				items: translateField
			});
			var currentLangs = new Ext.Container({
				id: 'currentLangs',
				cls: 'curL',
				listeners: {
					added: setLanguage
				}
			 });
			var languageList = [
				{value: "af", text: "Afrikaans"},
				{value: "sq", text: "Albanian"},
				{value: "ar", text: "Arabic"},
				{value: "be", text: "Belarusian"},
				{value: "bg", text: "Bulgarian"},
				{value: "zh-CN", text: "Chinese"},
				{value: "hr", text: "Croatian"},
				{value: "cs", text: "Czech"},
				{value: "da", text: "Danish"},
				{value: "nl", text: "Dutch"},
				{value: "en", text: "English"},
				{value: "et", text: "Estonian"},
				{value: "tl", text: "Filipino"},
				{value: "fi", text: "Finnish"},
				{value: "fr", text: "French"},
				{value: "gl", text: "Galician"},
				{value: "de", text: "German"},
				{value: "el", text: "Greek"},
				{value: "ht", text: "Haitian Creole"},
				{value: "iw", text: "Hebrew"},
				{value: "hi", text: "Hindi"},
				{value: "hu", text: "Hungarian"},
				{value: "is", text: "Icelandic"},
				{value: "id", text: "Indonesian"},
				{value: "ga", text: "Irish"},
				{value: "it", text: "Italian"},
				{value: "ja", text: "Japanese"},
				{value: "ko", text: "Korean"},
				{value: "lv", text: "Latvian"},
				{value: "lt", text: "Lithuanian"},
				{value: "mk", text: "Macedonian"},
				{value: "ms", text: "Malay"},
				{value: "mt", text: "Maltese"},
				{value: "no", text: "Norwegian"},
				{value: "fa", text: "Persian"},
				{value: "pl", text: "Polish"},
				{value: "pt", text: "Portuguese"},
				{value: "ro", text: "Romanian"},
				{value: "ru", text: "Russian"},
				{value: "sr", text: "Serbian"},
				{value: "sk", text: "Slovak"},
				{value: "sl", text: "Slovenian"},
				{value: "es", text: "Spanish"},
				{value: "sw", text: "Swahili"},
				{value: "sv", text: "Swedish"},
				{value: "th", text: "Thai"},
				{value: "tr", text: "Turkish"},
				{value: "uk", text: "Ukrainian"},
				{value: "vi", text: "Vietnamese"},
				{value: "cy", text: "Welsh"},
				{value: "yi", text: "Yiddish"}
			];
			var langPicker = new Ext.Picker({
				ui: 'dark',
				useTitles: false,
				height: 240,
				border: 'none',
				listeners: {
					hide: changeLanguage
				},
				doneButton: false,
				hideOnMaskTap: true,
				slots: [
						{
							name : 'languageFrom',
							align: 'left',
							data : languageList
							},{
							name : 'languageTo',
							align: 'left',
							data : languageList
						}
					]
			});
			//Currency conversion
			var currentCurs = new Ext.Container({
				id: 'currentCurs',
				cls: 'curC',
				listeners: {
					added: setCurrency
				}
			 });
	var currencyList = [
	 {value: "AWG", text: "Aruban Florin"},
	 {value: "AUD", text: "Australian Dollar"},
	 {value: "BSD", text: "Bahamian Dollar"},
	 {value: "BHD", text: "Bahraini Dinar"},
	 {value: "BBD", text: "Barbadian Dollar"},
	 {value: "BZD", text: "Belize Dollar"},
	 {value: "BRL", text: "Brazilian Real"},
	 {value: "BGN", text: "Bulgarian Lev"},
	 {value: "CAD", text: "Canadian Dollar"},
	 {value: "CYD", text: "Cayman Islands Dollar"},
	 {value: "CNY", text: "Chinese Yuan Renminbi"},
	 {value: "HRK", text: "Croatian Kuna "},
	 {value: "CZK", text: "Czech Koruna"},
	 {value: "DKK", text: "Danish Krone"},
	 {value: "DJF", text: "Djiboutian Franc"},
	 {value: "XCD", text: "East Caribbean Dollar"},
	 {value: "ERN", text: "Eritrean Nakfa"},
	 {value: "EEK", text: "Estonian Kroon"},
	 {value: "EUR", text: "Euro"},
	 {value: "HKD", text: "Hong Kong Dollar"},
	 {value: "HUF", text: "Hungarian Forint"},
	 {value: "INR", text: "Indian Rupee"},
	 {value: "IDR", text: "Indonesian Rupiah"},
	 {value: "JPY", text: "Japanese Yen"},
	 {value: "JOD", text: "Jordanian Dinar"},
	 {value: "LVL", text: "Latvian Lats"},
	 {value: "LBP", text: "Lebanese Pound"},
	 {value: "LTL", text: "Lithuanian Litas"},
	 {value: "MYR", text: "Malaysian Ringgit"},
	 {value: "MDR", text: "Maldavian Rufiyaa"},
	 {value: "MXN", text: "Mexican Peso "},
	 {value: "NZD", text: "New Zealand Dollar"},
	 {value: "NOK", text: "Norwegian Krone"},
	 {value: "OMR", text: "Omani Rial"},
	 {value: "QAR", text: "Quatari Riyal"},
	 {value: "PHP", text: "Philippine Peso"},
	 {value: "PLN", text: "Polish Zloty"},
	 {value: "RON", text: "New Romanian Leu"},
	 {value: "RUB", text: "Russian Rouble"},
	 {value: "SAR", text: "Saudi Riyal"},
	 {value: "SGD", text: "Singapore Dollar"},
	 {value: "ZAR", text: "South African Rand"},
	 {value: "KRW", text: "South Korean Won"},
	 {value: "SEK", text: "Swedish Krona"},
	 {value: "CHF", text: "Swiss Franc"},
	 {value: "THB", text: "Thai Baht"},
	 {value: "TRY", text: "New Turkish Lira"},
	 {value: "AED", text: "UAE Dirham"},
	 {value: "GBP", text: "UK Pound Sterling"},
	 {value: "USD", text: "US Dollar"},
	 {value: "VEF", text: "Venezuela Bol&iacute;var"}
	];
			var curPicker = new Ext.Picker({
				ui: 'dark',
				useTitles: false,
				height: 240,
				title: 'Currencies',
				border: 'none',
				doneButton: false,
				hideOnMaskTap: true,
				listeners:{
					hide: changeCurrency
				},
				slots: [
						{
							name : 'currencyFrom',
							align: 'left',
							data : currencyList
							},{
							name : 'currencyTo',
							align: 'left',
							data : currencyList
						}
					]
			});
			var curSubmit = new Ext.Button({
				cls: 'cs',
				id: 'cs',
				text: 'Convert',
				handler: convertCurrency
			});
			var nki = [];
			for (i=0; i<=9; i++) {
				nki[i] = new Ext.Button({
					id: 'nk'+i,
					cls: 'curBtn',
					text: ''+i,
					handler: pressNk
				});
			}
			var nkdot = new Ext.Button({
				id: 'nkdot',
				cls: 'curBtn',
				text: '.',
				handler: pressNk
			});
			var nkclear = new Ext.Button({
				cls: 'nkclear',
				id: 'nkclear',
				text: 'C',
				handler: pressNk
			});
			var nkr0 = new Ext.Container({
				id: 'nkDisplay',
				cls: 'nkRow',
				html: curToConv
			});
			var nkr1 = new Ext.Container({
				type: 'hbox',
				items: [nki[7],nki[8],nki[9]],
				cls: 'nkRow'
			});
			var nkr2 = new Ext.Container({
				type: 'hbox',
				items: [nki[4],nki[5],nki[6]],
				cls: 'nkRow'
			});
			var nkr3 = new Ext.Container({
				type: 'hbox',
				items: [nki[1],nki[2],nki[3]],
				cls: 'nkRow'
			});
			var nkr4 = new Ext.Container({
				type: 'hbox',
				items: [nkdot,nki[0],nkclear],
				cls: 'nkRow'
			});
			var nkr5 = new Ext.Container({
				type: 'hbox',
				items: [curSubmit],
				cls: 'nkRow'
			});
			var nk = new Ext.Container({
				type: 'vbox',
				//maxWidth: 320,
				items: [nkr0,nkr1,nkr2,nkr3,nkr4,nkr5],
				centered: true
			});
			var curSubmit2 = new Ext.Button({
				cls: 'cs2',
				id: 'cs2',
				text: 'Convert',
				handler: convertCurrency
			});
			var nki2 = [];
			for (i=0; i<=9; i++) {
				nki2[i] = new Ext.Button({
					id: 'nk2-'+i,
					cls: 'curBtn2',
					text: ''+i,
					handler: pressNk
				});
			}
			var nkdot2 = new Ext.Button({
				id: 'nkdot2',
				cls: 'curBtn2',
				text: '.',
				handler: pressNk
			});
			var nkclear2 = new Ext.Button({
				cls: 'nkclear2',
				id: 'nkclear2',
				text: 'C',
				handler: pressNk
			});
			var nk2r0 = new Ext.Container({
				id: 'nkDisplay2',
				cls: 'nkRow',
				html: curToConv
			});
			var nk2r1 = new Ext.Container({
				type: 'hbox',
				items: [nki2[0],nki2[1],nki2[2],nki2[3],nki2[4],nki2[5],nki2[6],nki2[7],nki2[8],nki2[9]],
				cls: 'nkRow'
			});
			var nk2r2 = new Ext.Container({
				type: 'hbox',
				items: [nkclear2,nkdot2,curSubmit2],
				cls: 'nkRow'
			});
			var nk2 = new Ext.Container({
				type: 'vbox',
				//maxWidth: 320,
				items: [nk2r0,nk2r1,nk2r2],
				centered: true,
				visible: false
			});
	// Saved Items
			var saveTrans = new Ext.Button({
				id: 'saveTrans',
				cls: 'saveTrans',
				hidden: true,
				html: '<div class="saveTransInner"></div>',
				padding: '0px',
				handler: saveTranslation
			});
			var saveCur = new Ext.Button({
				id: 'saveCur',
				cls: 'saveTrans',
				hidden: false,
				html: '<div class="saveTransInner"></div>',
				padding: '0px',
				handler: saveCurrency
			});
			var savedContainer = new Ext.Container(
				{styleHtmlContent: true,
				scroll: true,
				title: '<div class="transTab"></div>Translations',
				listeners:{
					activate: function() {savedContainer2.hide();
					}
				}
			});
			var savedContainer2 = new Ext.Container(
				{styleHtmlContent: true,
				scroll: true,
				title: '<div class="forexTab"></div>Currency',
					listeners:{
					activate: function() {savedContainer.hide();
					}
				}
			});
			// More...
			var aboutContainer = [{
				styleHtmlContent: true,
				scroll: false,
				cls: 'more1',
				html: '<h2>About:</h2><div class="aboutPara">The TravelMate web application was written by Mike Hardaker ' +
					'using HTML5, CSS3 and object-oriented JavaScript, with the <a href="http://www.sencha.com/" target=_blank>' +
					'Sencha Touch</a> application framework.</div>'},
				{styleHtmlContent: true,
				scroll: false,
				cls: 'more2',
				html:'<h2>Resources:</h2><div class="aboutPara">Translations make use of the <a href="http://www.google.com/" target=_blank>' +
						'Google Language AJAX API</a>.</div>' +
						'<div class="aboutPara">Exchange rate data is supplied by the <a href="http://www.ecb.int/"' +
						'target=_blank>European Central Bank</a>, updated each weekday and consumed via a custom RESTful API.</div>' +
						'<div class="aboutParaItalic">Disclaimer: the exchange rates shown are indicative rates and should be used ' +
						'as a guide only.</div>'},
				{styleHtmlContent: true,
				scroll: false,
				cls: 'more3',
				html: '<h2>Even more...</h2><div class="aboutPara">TravelMate\'s source code is available under the GPLv3 open source license.</div>' +
						'<div class="aboutPara tightPara"><span class="aboutBold">Contact</span> <a href="mailto:m@jag.gr">m@jag.gr</a></div>' +
						'<div class="aboutPara tightPara"><span class="aboutBold">Website</span> <a href="http://jag.gr/">http://jag.gr/</a></div>' +
						'<div class="aboutPara tightPara"><span class="aboutBold">Twitter</span> <a href="http://twitter.com/jaggrtweets">@jaggrtweets</a></div>' +
						'<div class="aboutPara tightPara"><span class="aboutBold">Facebook</span> <a href="http://www.facebook.com/jaggrpage">Jag.gr</a></div>'
				}];
			// Stores
			var storeLanguage = new Ext.data.Store({
					model: 'Language',
					data: languageList
			 });
			var storeCurrency = new Ext.data.Store({
					model: 'Currency',
					data: currencyList
			 });
			var storeForex = new Ext.data.Store({
				autoDestroy: true,
				storeId:'storeForex',
					model: 'Forex',
					proxy: {
						type: 'localstorage',
						id  : 'forexProxy'
					}
			});
  // Load Forex data
      var forexData = '',
      getForexData = 0;
      var dd = new Date();
      var dUTC = parseInt(((Date.parse(dd.toUTCString())/1000)/60),10);
      var forexDataSaved = localStorage.forexDataSaved;
      if (forexDataSaved){
        storeForex.load('forexProxy');
        //storeForex.sync();
        if(!storeForex.getCount()){getForexData = 1;}
        if (appActive()){getForexData = 1;}
        if (isNaN(dUTC - forexDataSaved)){getForexData = 1;}
      } else {
        getForexData = 1;
      }
      if (getForexData == 1) {
        setForexData();
      }

			// Title bar
			var navigationBar = new Ext.Toolbar({
					ui: 'dark',
					dock: 'top',
					title: '<img src="travelmate-nb.png" style="width:93px;height:16px">',
					items: saveTrans
			});
			// bottom tabs
			var translatePanel = [{
				title: 'Translate',
				iconCls: 'info',
				cls: 'card1',
				scroll: false,
				items: [{
					xtype: 'fieldset',
					items: [txtToTranslate]},
					clearBtn,
					txtTranslated],
					dockedItems: [{
						 xtype: 'toolbar',
						 dock: 'bottom',
						 items: [currentLangs,
					{xtype: 'spacer'},{
					text: 'Change...',
					handler: function() {
						langPicker.show();
						 }
						 }]
					}],
				listeners:{
					activate: setCard0
				}
			}];
			var currencyPanel = [{
				title: 'Currency',
				iconCls: 'download',
				cls: 'card2',
				layout: 'vbox',
				align: 'stretch',
				centered: true,
				scroll: false,
				items: [nk,nk2],
					dockedItems: [{
						 xtype: 'toolbar',
						 dock: 'bottom',
						 items: [currentCurs,
					{xtype: 'spacer'},{
					text: 'Change...',
					handler: function() {
						curPicker.show();
						 }
						 }]
					}],
				listeners:{
					activate: setCard1
				}
			}];
			var savedItemsPanel = [{
				xtype: 'tabpanel',
				id: '2',
				title: 'Saved Items',
				iconCls: 'favorites',
				cls: 'card3',
				scroll: true,
				items: [savedContainer, savedContainer2],
				listeners:{
					activate: setCard2
				},
			}];
			var morePanel = [{
				xtype: 'carousel',
				id: '3',
				title: 'More...',
				iconCls: 'more',
				cls: 'card4',
				scroll: false,
				items: [aboutContainer],
				listeners:{
					activate: setCard3
				}
			}];
			var tabBarItems = [
				translatePanel,
				currencyPanel,
				savedItemsPanel,
				morePanel
			];
			//bottom panel
			var tabpanel = new Ext.TabPanel({
				tabBar: {
					dock: 'bottom',
					layout: {
						pack: 'center'
					}
				},
				fullscreen: true,
				ui: 'dark',
				items: tabBarItems,
				activeItem: aC,
				dockedItems: navigationBar,
				listeners: {
					orientationchange: function(e,o,w,h){
						if (tabpanel.activeItem != 0){saveTrans.hide();}
						if (Ext.is.Phone) {
							if (o=='landscape'){
								nk.setVisible(false);
								nk2.setVisible(true);
							}
							else{
								nk.setVisible(true);
								nk2.setVisible(false);
							}
							if (e.getHeight() ==  480 || e.getHeight() == 320){
								e.setHeight(e.getHeight()-20);
								tabpanel.setPosition(0,20);
							} else {
							e.setPosition(0,0);}
							e.scroller.updateBoundary();
							e.scroller.scrollTo(0,0);
						}
					}
				}
			});
			curPicker.setValue({currencyFrom:cF,currencyTo:cT});
			langPicker.setValue({languageFrom:lF,languageTo:lT});
			if (tabpanel.getHeight() ==  480 || tabpanel.getHeight() == 320){
				tabpanel.setHeight(tabpanel.getHeight()-20);
				tabpanel.setPosition(0,20);
			}
			if (Ext.is.Phone) {
				if (tabpanel.activeitem != 0){saveTrans.setVisible(false);}
				if (tabpanel.getHeight() < tabpanel.getWidth()){
					nk.setVisible(false);
					nk2.setVisible(true);
				}
			} else {nk2.setVisible(false);}
			aC = null;
		}
	}
});