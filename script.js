
/* =====================================================
   MYSTERY GIFT WEBSITE
   JavaScript + EmailJS
===================================================== */


/* =====================================================
   01. EMAILJS CONFIG
===================================================== */

const EMAILJS_PUBLIC_KEY = "PZkwZWYDNG50dmOaY";
const EMAILJS_SERVICE_ID = "service_5zr2b0j";
const EMAILJS_TEMPLATE_ID = "template_nxr90ea";


/* =====================================================
   02. GET HTML ELEMENTS
===================================================== */

const welcomeScreen = document.getElementById("welcomeScreen");
const questionScreen = document.getElementById("questionScreen");
const giftScreen = document.getElementById("giftScreen");
const finalScreen = document.getElementById("finalScreen");

const startButton = document.getElementById("startButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");

const questionTitle = document.getElementById("questionTitle");
const questionNumber = document.querySelector(".question-number");

const answerArea = document.getElementById("answerArea");

const giftAnswer = document.getElementById("giftAnswer");

const progressDots = document.querySelectorAll(".progress-dot");


/* =====================================================
   03. INITIALIZE EMAILJS
===================================================== */

emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});


/* =====================================================
   04. QUESTIONS
===================================================== */

const questions = [

    {
        question: "What's something you've been wanting lately?",

        options: [
            "🎮 Something gaming-related",
            "🎧 Something techy",
            "👗 Clothes or accessories",
            "🧸 Something cute",
            "📚 Books or something to read",
            "🎨 Something related to my hobbies"
        ]
    },

    {
        question: "What kind of gift would make you the happiest?",

        options: [
            "💝 Something sentimental",
            "✨ Something pretty",
            "🎮 Something related to my interests",
            "💎 Something I'd keep for a long time",
            "🎁 Surprise me!"
        ]
    },

    {
        question: "Which one sounds most like you?",

        options: [
            "🌹 Elegant & classic",
            "🎀 Cute & cozy",
            "🖤 Dark & mysterious",
            "✨ Fancy & glamorous",
            "🌸 Simple & meaningful"
        ]
    }

];


/* =====================================================
   05. USER ANSWERS
===================================================== */

const answers = {
    questions: [],
    gift: ""
};


/* =====================================================
   06. CURRENT QUESTION
===================================================== */

let currentQuestion = 0;
let selectedAnswer = null;


/* =====================================================
   07. START WEBSITE
===================================================== */

startButton.addEventListener("click", function () {

    welcomeScreen.classList.add("hidden");

    questionScreen.classList.remove("hidden");

    loadQuestion();

});


/* =====================================================
   08. LOAD QUESTION
===================================================== */

function loadQuestion() {

    const current = questions[currentQuestion];

    selectedAnswer = null;

    nextButton.disabled = true;


    /* Question number */

    questionNumber.textContent =
        "Question " +
        String(currentQuestion + 1).padStart(2, "0");


    /* Question title */

    questionTitle.textContent =
        current.question;


    /* Remove old answers */

    answerArea.innerHTML = "";


    /* Create answer buttons */

    current.options.forEach(function (option) {

        const button = document.createElement("button");

        button.type = "button";

        button.classList.add("answer-option");

        button.textContent = option;


        button.addEventListener("click", function () {

            selectAnswer(button, option);

        });


        answerArea.appendChild(button);

    });


    updateProgress();

}


/* =====================================================
   09. SELECT ANSWER
===================================================== */

function selectAnswer(button, option) {

    const allOptions =
        document.querySelectorAll(".answer-option");


    allOptions.forEach(function (optionButton) {

        optionButton.classList.remove("selected");

    });


    button.classList.add("selected");

    selectedAnswer = option;

    nextButton.disabled = false;

}


/* =====================================================
   10. NEXT BUTTON
===================================================== */

nextButton.addEventListener("click", function () {

    if (selectedAnswer === null) {
        return;
    }


    /* Save answer */

    answers.questions[currentQuestion] =
        selectedAnswer;


    saveAnswers();


    /* Go to next question */

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    }

    else {

        questionScreen.classList.add("hidden");

        giftScreen.classList.remove("hidden");

    }

});


/* =====================================================
   11. UPDATE PROGRESS
===================================================== */

function updateProgress() {

    progressDots.forEach(function (dot, index) {

        dot.classList.remove("active");

        if (index === currentQuestion) {

            dot.classList.add("active");

        }

    });

}


/* =====================================================
   12. SUBMIT GIFT ANSWER
===================================================== */

submitButton.addEventListener("click", function () {

    const gift = giftAnswer.value.trim();


    /* Prevent empty answer */

    if (gift === "") {

        giftAnswer.focus();

        giftAnswer.style.borderColor = "#8e1f2d";

        return;

    }


    /* Save gift answer */

    answers.gift = gift;

    saveAnswers();


    /* Disable button */

    submitButton.disabled = true;

    submitButton.textContent = "Sending...";


    /* =================================================
       EMAIL TEMPLATE VARIABLES
    ================================================= */

    const templateParams = {

        question1: answers.questions[0] || "No answer",

        question2: answers.questions[1] || "No answer",

        question3: answers.questions[2] || "No answer",

        gift: answers.gift

    };


    /* =================================================
       SEND EMAIL
    ================================================= */

    emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
    )

    .then(function (response) {

        console.log(
            "SUCCESS!",
            response.status,
            response.text
        );


        /* Show final screen */

        giftScreen.classList.add("hidden");

        finalScreen.classList.remove("hidden");


        console.log("Mystery Gift Answers:");

        console.log(answers);

    })

    .catch(function (error) {

        console.error(
            "EMAILJS ERROR:",
            error
        );


        alert(
            "Something went wrong while sending your answer."
        );


        submitButton.disabled = false;

        submitButton.innerHTML =
            'Send my answer <span>💌</span>';

    });

});


/* =====================================================
   13. TEXTAREA RESET
===================================================== */

giftAnswer.addEventListener("input", function () {

    giftAnswer.style.borderColor = "";

});


/* =====================================================
   14. SAVE ANSWERS
===================================================== */

function saveAnswers() {

    localStorage.setItem(
        "mysteryGiftAnswers",
        JSON.stringify(answers)
    );

}


/* =====================================================
   15. DEBUG
===================================================== */

function showAnswersInConsole() {

    console.log(
        JSON.stringify(
            answers,
            null,
            4
        )
    );

}
