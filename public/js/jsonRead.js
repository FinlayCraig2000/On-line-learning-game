function changeAction(input) {
    document.getElementById("locationID").action = "/api/questions/" + input + "-questions.json";
}

function readJsonResults(userID, logs) {
    var obj, dbParam, xmlhttp, myObj, x, txt = "";
    obj = { limit: 5 };
    // console.log(userID);

    // In case there isn't a id set
    if (!userID) {
        return null;
    }

    dbParam = JSON.stringify(obj);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
            myObj = JSON.parse(this.responseText);

            // Create the table
            txt += "<table border='1'>"

            // Check what json is being requested
            if (!logs) {
                var s = document.getElementById("userIDQuestions");
                var selected = document.getElementById("userIDSubject").value;

                // console.log(selected)

                // console.log(myObj)

                for (x in myObj[selected + "-results"]) {
                    // console.log(myObj[selected + "-results"][x]["message"])
                    txt += "<tr><td class='padding-table'>" + myObj[selected + "-results"][x]["message"] + "</td></tr>";
                }

            }
            else {
                for (x in myObj[0]["teacher-user-messages"]) {
                    // console.log(myObj[0]["teacher-user-messages"])
                    // console.log(x)
                    //console.log(myObj["teacher-user-messages"][x])
                    txt += "<tr><td>" + myObj[0]["teacher-user-messages"][x]["message"] + "</td></tr>";
                }
            }
            
            // Finish table
            txt += "</table>"
            document.getElementById("json-content-container").innerHTML = txt;

            if (logs) {
                document.getElementById("locationID").action = "/api/user-logs/" + userID + "-user-logs.json";
            }
        }
    };

    // See what url is being requested
    if (!logs) {
        var urlJson = "\\api\\user-results\\" + userID + "-user-data.json";
    } else {
        var urlJson = "\\api\\user-logs\\" + userID + "-user-logs.json";
    }

    xmlhttp.open("GET", urlJson, true);
    xmlhttp.send();
    }


function readJsonResultsQuestions(jsonValue, graph) {
    var obj, dbParam, xmlhttp, myObj, x, txt = "";
    obj = { limit: 5 };
    // console.log(userID);

    // In case there isn't a id set
    if (!jsonValue) {
        return null;
    }

    dbParam = JSON.stringify(obj);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
            myObj = JSON.parse(this.responseText);

            // Create the table
            txt += "<table border='1'>"

            // console.log(myObj[0][jsonValue + "-questions"])

            for (x in myObj[0][jsonValue +"-questions"]) {
                txt += "<tr><td class='padding-table'>" + myObj[0][jsonValue + "-questions"][x]["message"] + "</td></tr>";
            }


            // Finish table
            txt += "</table>"
            document.getElementById("json-questions-content-container").innerHTML = txt;

            if (graph) {
                
            }
        }
    };

    // See what url is being requested
    var urlJson = "\\api\\questions\\" + jsonValue + "-questions.json";

    xmlhttp.open("GET", urlJson, true);
    xmlhttp.send();
    }