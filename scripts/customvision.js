$(function () {
    var uploadedImage;

    var showImage = function () {
        if (uploadedImage) {
            var blobUrl = window.URL.createObjectURL(uploadedImage);
            $("#ImageToAnalyze").attr("src", blobUrl);
        }
    };

    var getFaceInfo = function () {
        var predictionKey = "730e4a29e88e4c8ea0091d220229b9b7";
        var endpoint = "https://japaneast.api.cognitive.microsoft.com/customvision/v3.0/Prediction/9787b980-8a2e-494f-9f74-3eb7aadee53f/classify/iterations/Iteration1/image";

        var webSvcUrl = endpoint;

        var outputDiv = $("#OutputDiv");
        if (document.getElementById('imageFile').value == "") {
            outputDiv.text("Select your image.");
        }
        else {
            outputDiv.text("Analyzing...");
        }

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", webSvcUrl, true);
        xmlHttp.setRequestHeader("Prediction-Key", predictionKey);
        xmlHttp.setRequestHeader("Content-Type", "application/octet-stream");
        xmlHttp.send(uploadedImage);
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(this.responseText)
                var predictions = data.predictions;
                var probability = [];
                var tagName = [];
                for (var i = 0; i < predictions.length; i++) {
                    probability[i] = predictions[i].probability;
                    tagName[i] = predictions[i].tagName;
                }

                function floatFormat(number) {
                    return Math.round(number * Math.pow(10, 6)) / Math.pow(10, 6);
                }

                var outputText = "Result: ";
                outputText += tagName[0] + "<br>Probability: " + floatFormat(probability[0]) * 100 + "%";
                outputDiv.html(outputText);
            }
            else {
                outputDiv.text("ERROR!");
            };
        };
    };

    $("#imageFile").on('change', function (e) {
        uploadedImage = e.target.files[0];
        showImage();
        getFaceInfo();
    });

});