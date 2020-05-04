window.addEventListener ("load", myMain, false);

function myMain (evt) {
    // DO YOUR STUFF HERE.
    // document.getElementsByName("q")[0].value = "my first class";
    // localStorage.setItem("mytime", Date.now());
    // // Save it using the Chrome extension storage API.
    // var data = '{"name": "mkyong","age": 30,"address": {"streetAddress": "88 8nd Street","city": "New York"},"phoneNumber": [{"type": "home","number": "111 111-1111"},{"type": "fax","number": "222 222-2222"}]}';
    // var json = JSON.parse(data);
    // json.time = Date.now();
    // // var newData = JSON.stringify(json);
    // chrome.storage.sync.set({'storedb': json}, function() {
    //   console.log('Settings saved');
    // });

    // chrome.storage.local.clear();
    // chrome.storage.sync.clear();

    // var db = {};

    // chrome.storage.sync.get(["tmcDB"], function(items) {
    //    db = items;
    //   console.log('DB retrived:',db);
    //   updateDatabase(db);
    // });
   //  if( !hasOneDayPassed_other() ) return false;
   // if( hasOneDayPassed_other() ){
   //  console.log("final "+hasOneDayPassed_other());
       updateDatabase();
     // }


}
function getFromFB(){
  var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://tnmc-13f7b.firebaseio.com/rest/tnmc.json');
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function() {
      alert("Need to sync db..");
        console.log(xhr.readyState);
        console.log(xhr.status);
        var jsonP = JSON.parse(xhr.responseText);
          for (var [key, value] of Object.entries(jsonP)) {
              chrome.storage.local.set({[key]: value}, function() {
                 console.log('Database updated saved');
            });
          }
          uploadToFB();
      };
    xhr.send();
    console.log("sync with firsbase done");
  }
  function uploadToFB(){
    chrome.storage.local.get(null, function(items) { // null implies all items
      // Convert object to a string.
          var result = JSON.stringify(items);
          console.log("sync with firsbase");
          var x = new XMLHttpRequest();
          x.open('PATCH', 'https://tnmc-13f7b.firebaseio.com/rest/tnmc.json', true);
          x.setRequestHeader('Content-type','application/json; charset=utf-8');
          x.onload = function() {
            alert("synce db done");
          };
          x.send(result);
      });
  }
function uploadSite(){
  getFromFB();
}

function updateDatabase(){
  updateQuestion();
  if(document.getElementById("ContentPlaceHolder1_lblQuestion") != undefined){
    var question = document.getElementById("ContentPlaceHolder1_lblQuestion").innerHTML;
    searchStr(question);
  }
  // while(!dbretrived){
    //     setTimeout(function () {
          
    //   }, 5000);
    // }
    // chrome.storage.sync.clear();
    // var question = document.getElementById("ContentPlaceHolder1_lblQuestion").innerHTML;
   
    // var q1;
    //  chrome.storage.local.get([question], function(items) {
    //   console.log('question retrived:',items);
    //   if(items == undefined){
    //         q1 = {};
    //     }else{
    //       q1 = items;
    //     }
    // });


}
function searchStr(question){
  chrome.storage.local.get(null, function(items) {
      var allKeys = Object.keys(items);
      // for(i=0;i<allKeys.length;i++){
      //   var k = allKeys[i];
        // console.log(k);
        const f_ans = new Set();
        const f_wrong = new Set();

        chrome.storage.local.get(allKeys, function(items_data) {
          console.log(items_data);
          const values = Object.values(items_data)
          for(i=0;i<values.length;i++)
          {
              var s = values[i];
              if(question==s.name){
                var ans = s.answer;
                var wrong = s.optionsdb;
                for(j=0;j<ans.length;j++){
                  f_ans.add(ans[j]);
                }
                for(k=0;k<wrong.length;k++){
                  f_wrong.add(wrong[k]);
                }
              }

                if(f_ans.size <=0 && f_wrong.size <= 0){
                  if(question!=undefined && s.name != undefined){
                    var new_question = question.replace(/[&\/\\#,+()$~%.'"”“:*?<>{}]/g,'_');
                    var new_name = s.name.replace(/[&\/\\#,+()$~%.'"”“:*?<>{}]/g,'_');
                    if(new_name.includes("undergone laporatomy")){
                      console.log(new_question);
                      console.log(new_name);
                      console.log("done");
                    }
                    if(new_question==new_name){
                      var ans = s.answer;
                      var wrong = s.optionsdb;
                      for(j=0;j<ans.length;j++){
                        f_ans.add(ans[j]);
                      }
                      for(k=0;k<wrong.length;k++){
                        f_wrong.add(wrong[k]);
                      }
                    }
                  }
                }


          }    
          console.log(question);
          console.log(f_ans);
          console.log(f_wrong);
          chrome.storage.local.set({"question": question}, function() {
           console.log('Database updated question');
          });
          let ansArray = [];

          for(str of f_ans){
            ansArray.push(str);
          }

          const ansStr = ansArray.join(" <br />");
          chrome.storage.local.set({"f_ans": ansStr}, function() {
           console.log('Database updated f_ans');
          });
          let wrgArray = [];

          for(str of f_wrong){
            wrgArray.push(str);
          }

          const wrgStr = wrgArray.join(",");
          chrome.storage.local.set({"f_wrong": wrgStr}, function() {
           console.log('Database updated f_wrong');
          });

          var page_question = document.getElementById("ContentPlaceHolder1_lblQuestion");
          page_question.innerHTML += "<p class='Warningmessage_green' ><strong>"+ ansStr +"</strong><p>"+"<p class='Warningmessage' ><strong>"+ wrgStr +"</strong><p>";
              
                // for (var property in items_data) {
          //   console.log(property);
          //   const values = Object.values(property)
          // }
          // var x =JSON.parse(JSON.stringify(items_data));
          // console.log(x);
          // console.log(k);
          // console.log(x[k]);
          // if(question==items_data.name)
          console.log("All Db displayed");
        });
      // }
    });
}

function updateQuestion(){
  if(document.getElementsByClassName("WordSection1")!=undefined){
    console.log("searching string in  page");
    chrome.storage.local.get(["question","f_ans","f_wrong"], function(items_data) {
        console.log(items_data);
        console.log(items_data.question);
        if(window.find)
        {
          if(window.find(items_data.question.trim()))
          {
            var rng=window.getSelection().getRangeAt(0);
            console.log("found string");
          }else if(window.find(items_data.question.replace(":","?").trim())){
            var rng=window.getSelection().getRangeAt(0);
            console.log("found string2");
          }
        }
    });
  }
  if(document.getElementById("ContentPlaceHolder1_messageforQuestion")!=undefined)
  {
    var msg = document.getElementById("ContentPlaceHolder1_messageforQuestion").textContent.trim();

    var question = document.getElementById("ContentPlaceHolder1_lblQuestion").innerHTML;

    var options = document.getElementsByName("ctl00$ContentPlaceHolder1$Options");

    // console.log(msg);
    // console.log(question);
    // console.log(options);
    var q1 = {};

    q1.name =  question;
     q1.optionsdb = [];
     q1.answer = [];
    //  console.log(q1.options);
    // if(q1.options==undefined){
    //   optionsdb = {};
    // } else{
    //   optionsdb = q1.options;
    // } 
    //  console.log(q1);
    //  console.log(optionsdb);
    //  console.log("done");

    for(i=0;i < options.length;i++ ){

      if(msg=="Sorry,  Incorrect answer." || msg=="Sorry, Incorrect answer."){
        // console.log(options [i].checked);
        if(options[i].checked){
          q1.optionsdb.push(options[i].value);
        }
      }
      if(msg=="Good,  Right answer." || msg=="Good, Right answer."){
        if(options[i].checked){
          q1.answer.push(options[i].value);
        }
      }
      
    }
    // console.log();
    // console.log(optionsdb);
    // q1.options = optionsdb;
    // db[q1.name ] = q1;
    var key = Date.now();
    chrome.storage.local.set({[key]: q1}, function() {
       console.log('Database updated saved');
      });
  }
    
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
// 	console.log(tabs[0].url);
// 	var ticketID = getQueryVariable("id");
// 	console.log(ticketID);
// 	var inputTicket= document.getElementById('bottom_message').value;
// 	console.log(inputTicket);
// });

// checks if one day has passed. 
function hasOneDayPassed(){
  // get today's date. eg: "7/37/2007"
  var date = new Date().toLocaleDateString();

  // if there's a date in localstorage and it's equal to the above: 
  // inferring a day has yet to pass since both dates are equal.
  if( localStorage.yourapp_date == date ) 
      return false;

  // this portion of logic occurs when a day has passed
  localStorage.yourapp_date = date;
  return true;
}

// checks if one day has passed. 
function hasOneDayPassed_other(){
   var date = new Date().toLocaleDateString();
  console.log("Checking key");
  chrome.storage.local.get(["masterkey"], function(items_data) {
        console.log(items_data);
        console.log("after masterkey"+items_data.masterkey);
      localStorage.yourapp_date_other = date;
      localStorage.master = items_data.masterkey;
    });
    console.log("key Found :" + localStorage.master);
    console.log(localStorage.yourapp_date_other == date);
    console.log(localStorage.master == "ccmsd");
    console.log(localStorage.master);
   if( localStorage.yourapp_date_other == date && localStorage.master == "ccmsd" ) {
      console.log("return true");
      return true;
   }
    else{
      console.log("return false");
    return false;
  }
  
}



// some function which should run once a day
function runOncePerDay(){
  if( !hasOneDayPassed() ) return false;

  // your code below
  uploadSite();
}
function runOncePerDay_other(){
  if( !hasOneDayPassed_other() ) return false;
  throw new Error("Key Expired");
}

runOncePerDay(); // run the code
// runOncePerDay_other(); // does not run the code
