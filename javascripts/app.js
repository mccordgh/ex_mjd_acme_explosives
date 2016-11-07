/*jshint esversion: 6 */

var catMenu = document.getElementById('menu');
var productDisplay = document.getElementById('product_display');
var dataObj;

catMenu.addEventListener('change', handleMenuChange);
catMenu.disabled = true;	

Promise.all([getFile('data/categories.json'), getFile('data/products.json'), getFile('data/types.json')])
	.then((data) => {
		dataObj = data;
		catMenu.disabled = false;
	});

function handleMenuChange(event) {
	productDisplay.innerHTML = "";
	let products = gatherProducts(event.target.value)
	displayProducts(products);
}

function gatherProducts(category) {
	//dataObj[0] = categories, [1] = products, [2] = types
	var productTypes = [];
	var allProducts = [];
	var catId;
	var categories = dataObj[0].categories;
	var products = dataObj[1].products;
	var types = dataObj[2].types;
	var productKeys = Object.keys(dataObj[1].products[0]);
	var currentProduct;

	//get category id matching dropdown menu
	for (i=0; i < categories.length; i++) {
		if (categories[i].name === category) {
			catId = categories[i].id;
			break;
		}
	}

	//get types matching category id
	for (i=0; i < types.length; i++) {
		if (types[i].categoryId === catId) {
			productTypes.push(types[i].id);
		}
	}

	//get products matching type ids
	// loop for how many keys in products object
	for (i=0; i < productKeys.length; i++) {
		// loop through an array of type Ids that match the current selected category
		for (x=0; x < productTypes.length; x++) {
			currentProduct = products[0][productKeys[i]];
			if (currentProduct.typeId === productTypes[x]) {
				//fill final array, that will be pushed to DOM, with matches
				allProducts.push({name: currentProduct.name, description: currentProduct.description});
			}
		}
	}
	
	return allProducts;
}

function getFile(filePath) {
	return new Promise( (resolve, reject) => {
		$.ajax({
			url: filePath
		}).done((data) => {
			resolve(data);
		}).fail((error) => {
			reject(error);
		});
	});	
}

function displayProducts(products) {
	products.forEach ( (item) => {
		var newLi = document.createElement("LI");
		newLi.innerHTML = `Name: ${item.name}<br>Description: ${item.description}`;
		newLi.classList.add("col-md-10");
		productDisplay.appendChild(newLi);
	});
}