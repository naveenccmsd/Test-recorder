chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
        var headers = info.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1); // Remove header
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
);

// checks if one day has passed. 
function hasOneDayPassed_other(){
   var date = new Date().toLocaleDateString();
  console.log("Checking key");
  chrome.storage.local.get(["masterkey"], function(items_data) {
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

$(document).ready(function(){

    $( "#reset" ).click(function() {
      console.log("reset");
      resetStorage();
    });
    $( "#refresh" ).click(function() {
      console.log("refresh");
      refreshStorage();
      uploadSite();
    });
     $( "#search_btn" ).click(function() {
      console.log("search_btn");
      findQuestion($("#search").val());
    });

    console.log("test");
    // $('.loader').hide();
    // chrome.storage.sync.get({
    //   quick_access_url: 'https://www.producthunt.com'
    // }, function(items) {
    //   $('#quick_access_extension_frame').on('load', function() {
    //     $('.loader').hide();
    //   });
    //   $('#quick_access_extension_frame').attr('src', items.quick_access_url);
    // });
    // alert("hu");
    // conole.log("Hi..");
    // Read it using the storage API
    // chrome.storage.local.get(['tmcDB'], function(items) {
    //     $('#quick_access_extension_frame').html(items);
    //     console.log(Date.now());
    //     console.log(items);
    //     // var json = JSON.parse(items.storedb);
       
    //   // message('Settings retrieved', items);
    // });
   // var question = document.getElementById("ContentPlaceHolder1_lblQuestion").innerHTML;
   // $('#quick_access_extension_frame').html(question);
   //  chrome.storage.local.get(null, function(items) {
   //    var allKeys = Object.keys(items);
   //    for(i=0;i<allKeys.length;i++){
   //      var k = allKeys[i];
   //      console.log(k);
   //      chrome.storage.local.get([k], function(items_data) {
   //        console.log(items_data);
   //      });
   //    }
   //    console.log("All Db displayed");
   //  });
   refreshStorage();
    $( "#export" ).click(function() {
      console.log("export");
      downloadFile();
    });
    $( "#import" ).click(function() {
      console.log("import");
      uploadFile();
    });
    

});
function uploadFile(){
  var srch = $("#import_str").val();
  // console.log(srch);
  var jsonP = JSON.parse(srch);
  // console.log(Object.keys(jsonP).length);
  // var uniqObj = {};
  // for (var [key, value] of Object.entries(jsonP)) {
  //   console.log(`${key}: ${value}`);
  //   uniqObj[value.name] = value.answer[0];
  // }
  // console.log(Object.keys(uniqObj).length);
  // console.log(uniqObj);

  for (var [key, value] of Object.entries(jsonP)) {
    chrome.storage.local.set({[key]: value}, function() {
       console.log('Database updated saved');
      });
  }
}
function downloadFile(){
  chrome.storage.local.get(null, function(items) { // null implies all items
      // Convert object to a string.
      var result = JSON.stringify(items);

      // Save as file
      var url = 'data:application/json;base64,' + window.btoa(unescape(encodeURIComponent(result)));
      chrome.downloads.download({
          url: url,
          filename: 'filename_of_exported_file.json'
      });
  });
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
    // getKeyFB();
    console.log("sync with firsbase done");
  }
  function getKeyFB(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://tnmc-13f7b.firebaseio.com/rest/master.json');
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function() {
        console.log(xhr.responseText);
        var jsonP = JSON.parse(xhr.responseText);
         console.log(jsonP);
          // for (var [key, value] of Object.entries(jsonP)) {
              chrome.storage.local.set({"masterkey": jsonP}, function() {
                 console.log('masterkey updated'+ jsonP);
              });
              chrome.storage.local.get(["masterkey"], function(items_data) {
                 console.log(items_data);
               });
          // }
      };
    xhr.send();
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
function resetStorage(){
    chrome.storage.local.clear();
}
function findQuestion(str){
    searchStr(str);
}
function refreshStorage(){
    chrome.storage.local.get(["question","f_ans","f_wrong"], function(items_data) {
        console.log(items_data);
        console.log(items_data.question);
        console.log(items_data.f_ans);
        console.log(items_data.f_wrong);
        $("#question").html(items_data.question);
         $("#f_ans").html(items_data.f_ans);
          $("#f_wrong").html(items_data.f_wrong);
    });
}

function searchStr(question){
  chrome.storage.local.get(null, function(items) {
      var allKeys = Object.keys(items);
      // for(i=0;i<allKeys.length;i++){
      //   var k = allKeys[i];
        // console.log(k);
        var tmp_question = "";
        const f_ans = new Set();
        const f_wrong = new Set();

        chrome.storage.local.get(allKeys, function(items_data) {
          console.log(items_data);
          const values = Object.values(items_data);
          for(i=0;i<values.length;i++)
          {
              var s = values[i];
              var str_tmp=s.name;
              if(question == str_tmp){
                tmp_question = question;
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
          if(tmp_question == ""){  
              for(i=0;i<values.length;i++)
              {
                  var s1 = values[i];
                  var str_tmp1=s1.name;
                  console.log(s1);
                  if(str_tmp1!=undefined && str_tmp1.includes(question)){
                    // tmp_question = tmp_question.concat(",",str_tmp1.name);
                    tmp_question = tmp_question.concat("<h3>",s1.name,"<h3>"
                        ,"<p> Correct Answers : <br/>",s1.answer,"</p>"
                        ,"<p> Wrong Answers : <br/>",s1.optionsdb,"</p>");
                  }
              }  
          }  
          console.log(tmp_question);
          console.log(f_ans);
          console.log(f_wrong);
          chrome.storage.local.set({"question": tmp_question}, function() {
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
  refreshStorage();
}