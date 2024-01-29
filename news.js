import {API_KEY} from "./apiKey.js"

let lang = "hi";
let URL_LINK = `https://newsapi.org/v2/everything?language=${lang}`;

const menu = document.querySelector('#menu')
const searchPart = document.getElementById('searchPart')
const searchInput = document.getElementById('searchinput')
const searchBtn = document.getElementById('btnSearch')
const searchBar = document.getElementById('searchBar')
const searchCross = document.getElementById('searchCross')
const mainBody = document.getElementById('mainBody')
const filterSec = document.getElementById("filterSec")
const language = document.getElementById("lang")
const changeLanguage = document.getElementById("changeLanguage")
const ApplyBtn = document.getElementById("applyBtn")
const checkBox = document.getElementById('checkBox')
const mainSection = document.getElementById('mainSection')


window.addEventListener("load",()=>fetchNews())


//---------------------calling api----------------------------
 function fetchNews(value="global"){
    try {
        fetch(`${URL_LINK}&q=${value}&apiKey=${API_KEY}`)
        .then((res)=>res.json())
        .then((data)=>{
            if(data.totalResults===0) {
                return handleNoResult(value);
            }
            else{
               return cloningCards(data.articles)
            }
        })
    } catch (error) {
        console.log(error)
    }
}



//-----------------Handling If there is no articles--------------
let heading = document.createElement("h1")
function handleNoResult(topic){
    mainSection.style.display="none"
    heading.style.display = "block"
    heading.setAttribute("id","NoResult")
    heading.innerHTML = `Sorry --No Results of  ${topic}-- Found`
    mainBody.appendChild(heading)
}



//------------------Display all cards of News---------------------
function cloningCards(articles){
    mainSection.style.display = "flex"
    heading.style.display = "none"
    const card = document.getElementById("card");
    mainSection.innerHTML="";//empty iss liye kara jise jo news hai vo ek ke upar ek naa hoti rahe
    
    //console.log(articles);
    articles.map((value)=>{
        if(!value.urlToImage) return;
        const cardClone = card.cloneNode(true);
        fillingCardDetails(cardClone,value)
        mainSection.appendChild(cardClone);

    })
}

function fillingCardDetails(cardClone,value){
    const newImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#newsTitle');
    const subHeading = cardClone.querySelector('#subHeading');
    const smallDetail = cardClone.querySelector('#smallDetail');
    
    //console.log(value);
    newImg.src = value.urlToImage;
    newsTitle.innerHTML = value.title;
    smallDetail.innerHTML = value.description
    const date = new Date(value.publishedAt).toLocaleDateString()
    
    subHeading.innerHTML = `${value.source.name} - ${date}` 

    cardClone.addEventListener("click",()=>{
        window.open(value.url,"_blank")
    })
}


//------------------Top Headings-----------------------
let headingClicked = null;

menu.addEventListener("click", (e)=>{
    //console.log(e.target)
    fetchNews(e.target.innerHTML)
    headingClicked?.classList.remove("active")
    headingClicked = e.target
    headingClicked.classList.add("active")
})


//----------------------Search Buttons---------------------

searchBtn.addEventListener("click",()=>{
    if(!searchInput.value)return alert("Enter some field in search");
    fetchNews(searchInput.value)
    headingClicked?.classList.remove('active')
    headingClicked = null;
    searchInput.value =""
})

const logo = document.getElementById('logo')
logo.addEventListener("click",()=>{
    fetchNews()
    if (headingClicked!= null) {
        headingClicked.classList.remove("active")
    }
})




//-------------------Filter--------------------

let mainFilter = "off"
let langFilter = "off"



const filterBtn = document.getElementById("filterBtn");
filterBtn.addEventListener("click",()=>{
    mainFilter=="off"?
    (filterSec.style.display="block",mainFilter="on",mainSection.style.marginTop="5px",mainSection.style.filter="blur(10px)",mainSection.style.pointerEvents="none") 
    : (filterSec.style.display="none",mainFilter="off",mainSection.style.marginTop="100px",mainSection.style.filter="none",mainSection.style.pointerEvents="all")
})

language.addEventListener("click",()=>{
     langFilter=="off"?(changeLanguage.classList.add('langpop'),langFilter="on",language.style.borderWidth="2px 2px 0px 2px",ApplyBtn.classList.add("applypop")) : (changeLanguage.classList.remove('langpop'), langFilter="off",language.style.borderWidth="2px 2px 2px 2px",ApplyBtn.classList.remove("applypop"))
})

    
changeLanguage.addEventListener("click",(e)=>{
    if(e.target.id!=="changeLanguage"){
        if(e.target.id!==""){
            lang = e.target.id
        } 
    }
})

ApplyBtn.addEventListener("click",()=>{
    URL_LINK = `https://newsapi.org/v2/everything?language=${lang===""?"hi":lang}`;
    fetchNews();

    changeLanguage.classList.remove('langpop'), langFilter="off" ,language.style.borderWidth="2px 2px 2px 2px"
    filterSec.style.display="none";
    mainSection.style.marginTop="100px",mainSection.style.filter="none",mainSection.style.pointerEvents="all",
    ApplyBtn.classList.remove("applypop")
    if (headingClicked!= null) {
        headingClicked.classList.remove("active")
    }
})




//-------------------------DarkMode---------------------------

let mode = localStorage.getItem('mode');
if(mode==='dark'){
    checkBox.checked = true;
    document.body.classList.add('darkMode')
}
else{
    checkBox.checked = false;
    document.body.classList.remove('darkMode')
};

checkBox.addEventListener('click',(e)=>{
    
    switch (e.target.checked) {
        case (true):
            darkMode()
            break;
        case (false):
            lightMode()
            break;
        default:
            break;
    }
    
})

function darkMode(){
    document.body.classList.add('darkMode')
    localStorage.setItem('mode','dark')
}
function lightMode(){
    document.body.classList.remove('darkMode')
    localStorage.setItem('mode','light')
}



//--------------------------Responsive Search Btn------------------------

searchBar.addEventListener('click',()=>{
    searchBar.style.display='none';
    searchCross.classList.add('searchCross');
    searchPart.style.transform='translateX(0%)';
})

searchCross.addEventListener('click',()=>{
    searchCross.classList.remove('searchCross');
    searchBar.style.display='block';
    searchPart.style.transform='translateX(100%)'
})

searchBtn.addEventListener('click',(e)=>{
    if (searchInput.value) {
        searchCross.classList.remove('searchCross');
        searchBar.style.display='block';
        searchPart.style.transform='translateX(100%)'
    }
    else{
        return null
    }
})