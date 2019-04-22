"use strict";

const total = +prompt("Wpisz liczbę pytań do wylosowania", 15);
      
      (total == 0) ? location.reload() : init();

      function init(){
        let url =
              "https://raw.githubusercontent.com/HamadykLukasz/wshtwp-quiz/master/wprowadzenie_do_psychologii.json";
          fetch(url)
              .then(function (response) {
                  return response.json();
              })
              .then(function (data) {
                let questions = randomizeQuestions(data, total)
                let answers = new Array(total);

                displayResults(questions, answers);
              });
              

        // let questions = randomizeQuestions(total);
        // let answers = new Array(total);

        // displayResults(questions, answers);
      }

      function randomizeQuestions(data, n) {
        let result = new Array(n),
          len = data.length,
          taken = new Array(len);

        if (n > len)
          throw new RangeError("getRandom: more elements taken than available");

        while (n--) {
          let x = Math.floor(Math.random() * len);
          result[n] = data[x in taken ? taken[x] : x];
          taken[x] = --len in taken ? taken[len] : len;
        }
    
        return result;
      }

    //   function randomizeQuestions(n) {
    //     //whereas n = number of questions to randomize
    //     const allQuestions = JSON.parse(TEST_QUESTIONS);

    //     let result = new Array(n),
    //       len = allQuestions.length,
    //       taken = new Array(len);

    //     if (n > len)
    //       throw new RangeError("getRandom: more elements taken than available");

    //     while (n--) {
    //       let x = Math.floor(Math.random() * len);
    //       result[n] = allQuestions[x in taken ? taken[x] : x];
    //       taken[x] = --len in taken ? taken[len] : len;
    //     }

    //     return result;
    //   }

      function displayResults(questions, answers){
        for (let i = 1; i<=questions.length; i++){
            generateQuestion(questions, i);
        }
        prepareAnswerNodes(answers);
        document.getElementById("btn-finish").disabled = true;
        document.getElementById("btn-finish").onclick = function() {countPoints(questions, answers)};
      }

      function prepareAnswerNodes(answers){
        let answerNodes = document.querySelectorAll('li[id^="q-"]');
        
        for (let answer of answerNodes) {
	        answer.onclick = function(){storeAnswer(this.id, answers)};
        }
      }

      function checkTotalAnswers(answers){
        if(!answers.includes(undefined)){
            let btn = document.getElementById("btn-finish");
            let info = document.getElementById("info-finish");
            btn.disabled = false; 
            info.parentNode.removeChild(info); 
        }
      }

      function storeAnswer(nodeId, answers){
        let answerId, selectedAnswer;

        selectAnswer(nodeId);

        answerId = nodeId.split("-")[1];
        selectedAnswer = nodeId.split("-")[2];

        answers.splice(answerId-1, 1, selectedAnswer);
        checkTotalAnswers(answers);
      }

      function selectAnswer(id){
        let tileId = id.split('-')[0] + '-' + id.split('-')[1];
        let possibleAnswers = document.querySelectorAll('li[id^="'+tileId+'"]');
		
		for (let answer of possibleAnswers){
			answer.classList.remove("selected");
        }
		document.getElementById(id).classList.add("selected");
      }

      function countPoints(questionsArr, answersArr){
        let points = 0;

        for(let i = 0; i < answersArr.length; i++){

            if(questionsArr[i].correct !== answersArr[i]) continue;

            points++;
        }
    
        if(calculatePercentage(points, total) >= 60 && calculatePercentage(points, total) <= 100){
            Swal.fire(
            'Gratulacje!',
            'Liczba poprawnych odpowiedzi: ' + points + "/" + total + " ("+ Math.round(calculatePercentage(points, total)) + "%)",
            'success'
            ).then(function(){
                highlightAnswers(questionsArr, answersArr);
            });
        } else {
            Swal.fire(
            'Niestety :(',
            'Liczba poprawnych odpowiedzi: ' + points + "/" + total + " ("+ Math.round(calculatePercentage(points, total))  + "%)",
            'error'
            ).then(function(){
                highlightAnswers(questionsArr, answersArr);
            });
        }
      }

      function calculatePercentage(part, total){
          return (100 * part) / total;
      }

      function highlightAnswers(questions, answers){
          for(let i = 0; i < total; i++){
            let selectedId, correctId;
            let j = i+1;

            if(questions[i].correct == answers[i]){
                selectedId = "q-" + j + "-" + answers[i];
                document.getElementById(selectedId).classList.add("correct");
                document.getElementById(selectedId).classList.remove("selected");
            } else {
                selectedId = "q-" + j + "-" + answers[i];
                correctId = "q-" + j + "-" + questions[i].correct;
                document.getElementById(selectedId).classList.add("wrong");
                document.getElementById(correctId).classList.add("correct");
                // document.getElementById(selectedId).classList.remove("selected");
            }
          } 
      }

      function generateQuestion(questions, id){
        let html = "";
        html += "<div class='tile'>";
        html += "<div class='q-body'>" + id + ". " + questions[id-1].body + "</div>";
        html += "<ul class='q-answers'>";
        html += "<li id='q-"+id+"-a'>a) "+questions[id-1].answer.a+"</li>";
        html += "<li id='q-"+id+"-b'>b) "+questions[id-1].answer.b+"</li>";
        html += "<li id='q-"+id+"-c'>c) "+questions[id-1].answer.c+"</li>";
        html += "<li id='q-"+id+"-d'>d) "+questions[id-1].answer.d+"</li>";
        html += "</ul>";

        document.getElementById("results").innerHTML += html;
      }