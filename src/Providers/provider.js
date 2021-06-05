// const url = '/getitems'
let itemsApiData;
fetch('http://localhost:5000/get_items')
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        itemsApiData = data
    })
    .catch(err => console.log(err))

module.exports = itemsApiData;
