
if( !QUnit.urlParams.storage ){
	evoShop.empty();
	evoShop.add({
		name: "Cool T-shirt",
		price: 25,
		thumb: "http://www.google.com/intl/en_com/images/srpr/logo3w.png"
	});
	var mark = document.location.href.match(/\?/) ? "&" : "?";
	document.location.href = document.location.href + mark + "storage=true";
}


module('evoShop-storage');
test("proper loading after page refesh", function(){

	var item = evoShop.find({})[0];
	
	same( item.quantity() , 1 , "item quantity loaded properly" );
	same( item.get('name') , "Cool T-shirt" , "item name loaded properly" );
	same( item.price() , 25 , "item price loaded properly" );
	same( evoShop.quantity() , 1 , "sc quantity loaded properly" );
	same( evoShop.total() , 25 , "sc total loaded properly" );
	same( item.get("thumb") , "http://www.google.com/intl/en_com/images/srpr/logo3w.png" , "storage non-regular option works" );
	
	
});


test("evoShop handles corrupt storage", function(){

	// like a stick in the spokes of a 10 speed
	localStorage.setItem( "evoShop_items" , "%%%%%%%%" );
	
	evoShop.load();
	
	
});


module('evoShop core functions');
test("adding and removing items", function(){
	
	evoShop.empty();
	
	same( evoShop.quantity() , 0 , "Quantity correct after one item added" );
	
	var item = evoShop.add({
		name: "Cool T-shirt",
		price: 25
	});
	
	same( evoShop.quantity() , 1 , "Quantity correct after one item added" );
	same( evoShop.total() , 25 , "Total correct after one item added" );
	same( item.get( 'price' ) , 25 , "Price is correctly saved" );
	same( item.get( 'name' ) , "Cool T-shirt", "Name is correctly saved" );
	
	
	var item2 = evoShop.add({
		name: "Really Cool T-shirt",
		price: "25.99"
	});
	
	
	var items = evoShop.find();
	
	same( items.length , 2 , "new items being recognized");
	ok( item2.equals( item2 ), "same items are .equal" );
	ok( !item2.equals( item ), "no false positives on item.equal" );
	
	same( item2.price() , 25.99 , "Price as string works");
	
	var item3 = evoShop.add({
		name: "Reeeeeally Cool Sweatshirt",
		UUID: "xxxfdajfdsf823jf92j9fj9f23",
		price: "$36"
	});
	
	same( item3.price() , 36 , "Price with dollar sign in front is parsed correctly");
	
	
	evoShop.empty();
	
	var item4 = evoShop.add({
		name: "RaceCar",
		quantity: 1.4342
	});
	
	same( item4.quantity() , 1 , "Item quantity parsed as INT and not decimal");
	same( evoShop.quantity(), 1 , "evoShop quantity parsed as INT and not decimal");
	
});

test("editing items", function(){	
	
	evoShop.empty();
	
	var item = evoShop.add({
		name: "Cool T-shirt",
		price: 25
	});
	
	item.set( "name" , "Really Cool Shorts" );
	item.set("quantity" , 2 );
	
	same( item.get( "name" ) , "Really Cool Shorts" , "Name attribute updated with .set" );
	same( item.get( "quantity" ) , 2 , "quantity updated with .set" );
	
	item.quantity(2);
	
	same( item.quantity() , 2 , "Setting quantity with item.quantity() works" );
	
	item.increment();
	
	same( evoShop.quantity() , 3 , "Quantity is two after item incremented");
	same( item.quantity() , 3 , "Item quantity incremented to 2" );
	same( evoShop.total() , 75 , "Total increased properly after incremented item");
	
	item.increment( 5 );
	
	same( item.quantity() , 8 , "Quantity incremented with larger value");
	
	item.remove();
	
	same( evoShop.quantity() , 0 , "Quantity correct after item removed" );
	same( evoShop.total() , 0 , "Total correct after item removed" );
	
});


	test("evoShop.chunk() function works", function(){
		
		var str = "11111" + "11111" + "11111" + "11111" + "11111",
			array = [ "11111" , "11111" , "11111" , "11111" , "11111" ];
			test = evoShop.chunk( str , 5 );
			
		same( test , array , "chunked array properly into 5 piece chunks");
		
	});
	
	test("evoShop.toCurrency() function works", function(){
		
		var number = 2234.23;
		
		same( evoShop.toCurrency( number ), "&#36;2,234.23" , "Currency Base Case");
		
		same( evoShop.toCurrency( number , { delimiter: " " }) ,"&#36;2 234.23" ,  "Changing Delimiter");
		
		same( evoShop.toCurrency( number , { delimiter: "&thinsp;" }) ,"&#36;2&thinsp;234.23" ,  "Multi Character Delimiter");

		same( evoShop.toCurrency( number , { decimal: ","  }) ,  "&#36;2,234,23" , "Changing decimal delimiter");

		same(  evoShop.toCurrency( number , { symbol: "!"  }) , "!2,234.23" , "Changing currency symbol");
		
		same( evoShop.toCurrency( number , { accuracy: 1  }) , "&#36;2,234.2" ,  "Changing decimal accuracy");
		
		same( evoShop.toCurrency( number , { after: true  }) ,  "2,234.23&#36;" , "Changing symbol location");
		
		same( evoShop.toCurrency( number , { symbol: "", accuracy:0, delimiter:"" }) , "2234", "Long hand toInt string" );
		
		
	});
	
	
	test("evoShop.each() function works", function(){
		
		Object.prototype.extra = function(){};
		Array.prototype.awesome = function(){};
		
		var myObject = {'bob':4 , 'joe':2 , bill: function(){} , jeff:9 },
			myArray = ['bob','joe','bill','jeff'];
		
		function test_object_prototype(){
			var test = true;
			evoShop.each( myObject , function(val,x,name){
				if( name === "extra" ){
					test = false;
				}
			});
			return test;
		}
		
		function test_array_prototype(){
			var test = true;
			evoShop.each( myArray , function(val,x){
				if( x === 4 ){
					test = false;
				}
			});
			return test;
		}
		
		function output_members(){
			var ms = "";
			evoShop.each( myObject , function(val,x,name){
				ms += name;
			});
			return ms;
		}
		
	
		
		ok( test_object_prototype() , "prototype attrs dismissed for object " );
		ok( test_array_prototype() , "prototype attrs dismissed for array " );
		same( output_members() , "bobjoebilljeff" , "items iterated properly");
	
	});
	
	asyncTest("evoShop.ready() works", function(){
		evoShop.ready(function(){
			ok(true);
			start();
		});
	});
	
	

	test("evoShop.copy() function works", function(){
			
		var sc_demo = evoShop.copy('sc_demo');
		sc_demo.add({ name:"bob",price:34,size:"big"});
		
	});
	
	



	
	module('Events');
	test("Event return values work", function(){
		
	
		evoShop.empty();
		
		evoShop.bind( 'beforeAdd' , function( item ){
			if( item.get( 'special_value') === 'do not add' ){
				return false;
			}
		});
		
		
		evoShop.add({ name: "neat thing" , price: 4 , special_value: 'do not add' });
		same( evoShop.quantity() , 0 , "Returning false on 'beforeAdd' event prevents item from being added to the cart");
		
		
		evoShop.empty();
		
		evoShop.bind( 'beforeRemove' , function( item ){
			if( item.get( 'special_value' ) === 'do not remove' ){
				return false;
			}
		});
		
		var item = evoShop.add({ name: "thing" , price: 3 , special_value: "do not remove" });
		
		item.remove();
		
		same( evoShop.quantity() , 1 , "Returning false on 'beforeRemove' event prevents item from being removed.");
		
		evoShop.empty();
		
		same( evoShop.quantity() , 1 , "Empty does not clear when beforeRemove prevents items from being removed");
		
		item.set("special_value" , "hullo");
		
	});
	
	
	test("Add item on load is quiet", function(){
	
		evoShop.empty();
		
		var beforeadd_not_called = true,
			afteradd_not_called = true;
			
		evoShop.add({name:'yo', price:1});
		
		evoShop.bind( 'beforeAdd' , function( item ){
			beforeadd_not_called = false;
		});
		
		evoShop.bind( 'afterAdd' , function( item ){
			afteradd_not_called = false;
		});
				
		evoShop.load();
	
		ok( beforeadd_not_called , "beforeAdd event is not called on load" );
		ok( afteradd_not_called , "afterAdd event is not called on load" );
		
	});
	
	
	test(".on works", function(){
		
		
		evoShop.empty();
		var on_before_add_called = false;
		evoShop.on( 'beforeAdd', function(){
			on_before_add_called = true;
		});
		
		evoShop.add({ name: "thing" , price: 4 });
		
		ok( on_before_add_called , ".on() alias for .bind() works");
		
	});
	
	test("bind multiple events at once", function(){
		
		evoShop.empty();
		var callback_called_count = 0,
			multispace_callback_called_count = 0;
			
		evoShop.on( 'beforeAdd afterAdd', function(){
			callback_called_count++;
		});
		
		evoShop.on( 'beforeAdd   afterAdd', function(){
			multispace_callback_called_count++;
		});
		
		evoShop.add({ name: "thing" , price: 4 });
		
		same( callback_called_count, 2 , "binding to space seperated list of event names works");
		same( multispace_callback_called_count, 2 , "binding to space seperated list (w/ several spaces) of event names works");
		
	});
	
	module('tax and shipping');
	test("shipping works", function(){
			
		evoShop.empty();
		evoShop({
			taxRate: 0.06 ,
			shippingFlatRate: 20
		});
		
		evoShop.add({name: "bob" , price: 2 });
		
		same( evoShop.taxRate() , 0.06 , "Tax Rate saved properly");
		same( evoShop.tax() , 0.06*2 , "Tax Cost Calculated properly");
		same( evoShop.shipping() , 20 , "Flat Rate shipping works");
		
		
		evoShop({
			shippingQuantityRate: 3
		});
		
		same( evoShop.shipping() , 20 + 1*3 , "Shipping Quantity Rate works");
		
		evoShop({
			shippingTotalRate: 0.1
		});
		
		
		same( evoShop.shipping() , 20 + 1*3 + 0.1*2 , "Shipping Quantity Rate works");
		
		
		evoShop({
			shippingFlatRate: 0 ,
			shippingQuantityRate: 0 ,
			shippingTotalRate: 0 ,
			taxRate: 0 ,
			shippingCustom: function(){
				return 45;
			}
		});
		
		evoShop.empty();
		same( evoShop.shipping() ,  45 , "Custom Shipping works");
		
		evoShop.add({name:"cool",price:1,shipping:45});
		same( evoShop.shipping() ,  90 , "item shipping field works");
		
		evoShop.Item._.shipping = function(){
			if( this.get('name') === 'cool'){
				return 5;
			} else {
				return 1;
			}
		};
		
		evoShop.empty();
		evoShop.add({name:'cool',price:2});
		evoShop.add({name:'bob',price:3});
		evoShop.add({name:'weird',price:3});
		evoShop({
			shippingCustom: null
		});
		same( evoShop.shipping() ,  7 , "Item shipping prototype function works");
	});
	test("tax works", function(){
		
		evoShop.empty();
		evoShop({
			taxRate: 0.06 
		});

		evoShop.add({name: "bob" , price: 2 });

		same( evoShop.taxRate() , 0.06 , "Tax Rate saved properly");
		same( evoShop.tax() , 0.06*2 , "Tax Cost Calculated properly");
		
		evoShop({
			shippingFlatRate: 0 ,
			shippingQuantityRate: 0 ,
			shippingTotalRate: 0 ,
			shippingCustom: function(){
				return 5;
			},
			taxShipping: true
		});
		
		same( evoShop.tax() , 0.06*(evoShop.shipping()+evoShop.total()) , "taxShipping works correctly" );
		
		evoShop({
			taxShipping: false
		});
		
		
		evoShop({
			taxRate: 0 
		});
		evoShop.empty();
		evoShop.add({name:"cool",price:2,taxRate:0.05});
		same( evoShop.tax() ,  2*0.05 , "Individual item tax rate works");
		
		
		evoShop.empty();
		evoShop.add({name:"cool",price:2,tax:1});
		same( evoShop.tax() ,  1 , "Individual item tax cost works");
		
		evoShop.empty();
		evoShop.add({name:"cool",price:2,tax:function(){
			return this.price()*0.1;
		}});
		same( evoShop.tax() , 0.2, "individual tax cost function works");
		
		evoShop.empty();
		
	});
	
	
	test("tax and shipping send to paypal", function(){
		
		evoShop({
			taxRate: 0.5
		});
		
		evoShop.shipping(function(){
			return 5.55555;
		});
		
		evoShop.empty();
		evoShop.add({
			name: "cool thing with weird price",
			price: 111.1111111111
		});
		
		evoShop({
			checkout: {
				type: "PayPal",
				email: "you@yours.com"
			}
		});
		
		evoShop.bind( "beforeCheckout" , function(data){
			
			same( data.amount_1 , ( data.amount_1*1).toFixed(2) , "Item price is correctly formatted before going to paypal");	
			same( data.tax_cart ,  ( data.tax_cart*1 ).toFixed(2) , "Tax is correctly formated before going to paypal");
			same( data.handling_cart , ( data.handling_cart*1 ).toFixed(2) ,"Shipping is correctly formated before going to paypal" );
			
			return false;
		});
		
		
		evoShop.checkout();
		
	});
	
	
	module('evoShop.find');
	test("evoShop.find() function works", function(){
			
		evoShop.empty();
		var bob = evoShop.add({name: "bob" , price: 2 , color:'blue' , size: 6 }),
			joe = evoShop.add({name: "joe" , price: 3 , color:'orange' , size: 3 }),
			jeff = evoShop.add({name: "jeff" , price: 4 , color:'blue' , size: 4 }),
			bill = evoShop.add({name: "bill" , price: 5 , color:'red' , size: 5 }),
		
		 	orange_items = evoShop.find({ color: 'orange' }),
			expensive = evoShop.find({ price: '>=4' }),
			small = evoShop.find({ size: '<5' }),
			bob_search = evoShop.find({ name: "bob" }),
			blue_and_big = evoShop.find({ color: 'blue', size: '>4' });
			
			
		
			
		
		same( evoShop.find(bob.id()).id() , bob.id() , "Searching with id works");
		same( orange_items[0].id() , joe.id() , "Searching with string = val works");
		same( expensive[0].id() , jeff.id(), "Searching >= works");
		same( small[0].id() , joe.id(), "Searching < works");
		same( bob_search[0].id() , bob.id(), "Searching by name works");
		same( blue_and_big[0].id() , bob.id(), "Searching on multiple indices works");
				
	});
	
	test("basic outlets work", function(){
	
		var item = evoShop.add({
			name: "Cool T-shirt",
			price: 25
		});

		document.getElementById('test_id').innerHTML = evoShop.quantity();
		same( document.getElementById('evoShop_quantity').innerHTML , document.getElementById('test_id').innerHTML , "quantity outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.toCurrency( evoShop.total() );
		same( document.getElementById('evoShop_total').innerHTML , document.getElementById('test_id').innerHTML, "total outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.taxRate().toFixed();
		same( document.getElementById('evoShop_taxRate').innerHTML , document.getElementById('test_id').innerHTML , "taxRate outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.toCurrency( evoShop.tax() );
		same( document.getElementById('evoShop_tax').innerHTML , document.getElementById('test_id').innerHTML , "tax outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.toCurrency( evoShop.shipping() );
		same( document.getElementById('evoShop_shipping').innerHTML , document.getElementById('test_id').innerHTML , "shipping outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.toCurrency( evoShop.grandTotal() );
		same( document.getElementById('evoShop_grandTotal').innerHTML , document.getElementById('test_id').innerHTML , "grand total outlet works" );
		
		
		
	});
	
	test("basic outlets work", function(){
	
		var item = evoShop.add({
			name: "Cool T-shirt",
			price: 25
		});

		document.getElementById('test_id').innerHTML = evoShop.quantity();
		same( document.getElementById('evoShop_quantity').innerHTML , document.getElementById('test_id').innerHTML , "quantity outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.toCurrency( evoShop.total() );
		same( document.getElementById('evoShop_total').innerHTML , document.getElementById('test_id').innerHTML, "total outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.taxRate().toFixed();
		same( document.getElementById('evoShop_taxRate').innerHTML , document.getElementById('test_id').innerHTML , "taxRate outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.toCurrency( evoShop.tax() );
		same( document.getElementById('evoShop_tax').innerHTML , document.getElementById('test_id').innerHTML , "tax outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.toCurrency( evoShop.shipping() );
		same( document.getElementById('evoShop_shipping').innerHTML , document.getElementById('test_id').innerHTML , "shipping outlet works" );
		
		document.getElementById('test_id').innerHTML = evoShop.toCurrency( evoShop.grandTotal() );
		same( document.getElementById('evoShop_grandTotal').innerHTML , document.getElementById('test_id').innerHTML , "grand total outlet works" );
				
	});
	
	

	
// just incase we refresh ;)
	evoShop.empty();
	evoShop.add({
		name: "Cool T-shirt",
		price: 25,
		thumb: "http://www.google.com/intl/en_com/images/srpr/logo3w.png"
	});	
