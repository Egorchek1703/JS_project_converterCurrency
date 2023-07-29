// Метод fetch возвращает не объект а Promise внутри которого лежит необходимый объект в поле результат (result)
// Для того чтобы достать необходимую информацию из этого promise, необходимо реализовать у него метод then() в котором в 
// callback функцию передать результат fetch и вернуть из then() вызванный у этого результата(Promise) метод json() 
// После преобразования с помощью json() необходимо еще в одном методе then в callback функцию передать результат выполнения прошлого then()
// и теперь данный объект (data) и будет объектом JavaScript в котором лежит необходимая информация

// fetch('https://www.cbr-xml-daily.ru/daily_json.js').then((result)=>{
//     return result.json()
// }).then((data)=>{
//     console.log(data)
// })

// ------------------------------------------------------------------------------------------------------------------------------------------------------------

// Метод с большим количество then() можно использовать, но лучше получить данный через асинхронную функцию и ключевые слова await (подождать)
// Запись ниже задает внутри функции поведение: положить в переменную результат fetch(), но не выполнять код, до того как fetch() получит ответ  
// Такой подход реализован для того, чтобы избежать ситуации когда результат fetch() еще не получен, а считыватель кода уже реализует операции с переменной 
// в которой должен находиться этот результат

// ! Пишем функцию которая получает результат fetch() и вкладывает необходимые объекты валют в внешний объект rates

let response
let resultFetch
let data

let rates = {

}

async function getResponse(){
    response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    resultFetch = await response.json()

    rates.USD = resultFetch.Valute.USD
    rates.EUR = resultFetch.Valute.EUR
    rates.GBP = resultFetch.Valute.GBP
}

// ! Пишем функцию, которая задает значения курса элементам на странице(span) для наглядности

let selectGive = document.querySelector('.select-give')
let selectGet = document.querySelector('.select-get')
let currencyRateOnPage = document.querySelectorAll('.currency-name')

async function setRates(){
    for(let i=0; i<currencyRateOnPage.length; i++){
        if(currencyRateOnPage[i].getAttribute('data-currency') == rates.EUR.CharCode){
            currencyRateOnPage[i].querySelector('span').innerHTML = rates.EUR.Value.toFixed(2)
        } 
        if(currencyRateOnPage[i].getAttribute('data-currency') == rates.USD.CharCode){
            currencyRateOnPage[i].querySelector('span').innerHTML = rates.USD.Value.toFixed(2)
        } 
        if(currencyRateOnPage[i].getAttribute('data-currency') == rates.GBP.CharCode){
            currencyRateOnPage[i].querySelector('span').innerHTML = rates.GBP.Value.toFixed(2)
        } 
    }  
}

// ! Пишем функцию, которая в зависимости от выбранной валюты обращается к нужному объекту в rates, затем умножает количество введенных рублей на свойство value
// подразумевающее курс выюранной валюты по отношению к рублюы

let inputGet = document.querySelector('.input-get')
let inputGive = document.querySelector('.input-give')

async function changeCurrency(){
    inputGive.addEventListener('input', ()=>{
        if(selectGive.value.toUpperCase().indexOf('RUB') > -1){
            if(selectGet.value.toUpperCase().indexOf(rates.USD.CharCode) > -1){ 
                inputGet.value = Number((Number(inputGive.value) * Number(rates.USD.Value.toFixed(2))).toFixed(2))
            }
            if(selectGet.value.toUpperCase().indexOf(rates.EUR.CharCode) > -1){ 
                inputGet.value = Number((Number(inputGive.value) * Number(rates.EUR.Value.toFixed(2))).toFixed(2))
            }
            if(selectGet.value.toUpperCase().indexOf(rates.GBP.CharCode) > -1){ 
                inputGet.value = Number((Number(inputGive.value) * Number(rates.GBP.Value.toFixed(2))).toFixed(2))
            }
            else if(selectGet.value.toUpperCase().indexOf('RUB') > -1){
                inputGet.value = inputGive.value
            }
        }
    })
}

// ! Пишем функцию присваюивающую слушатель событий для выбираемой валюты так, чтобы при изменении выбранной валюты значения input сбрасывались

async function changeSelectedCurrency(){
    selectGet.addEventListener('input', ()=>{
        inputGet.value = inputGive.value = ''
    })
}

//  ! Объединяем все функции в логическом порядке, используя ключевое слово await, после загрузки страницы

window.addEventListener('load', async function afterLoadWindow(){
    await getResponse()
    await setRates()
    await changeCurrency()
    await changeSelectedCurrency()
})
