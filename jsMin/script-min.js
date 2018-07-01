$(document).ready(function(){var e={globalElements:{numberPpl:document.querySelector(".people"),search:$("#search")[0],return:$("#return")[0],topper:$(".topper")[0],vehicleOptions:[],distance:0,diffDays:0,results:$(".results")[0],price:[],fuelKm:[],mapChart:$("#mapChart")[0],bookingConfirmed:$("#bookingConfirmed")[0]},eventListener:function(){e.globalElements.numberPpl.addEventListener("click",e.peopleButtons,!1),e.globalElements.search.addEventListener("click",e.searchButton,!1),e.globalElements.mapChart.addEventListener("click",e.chartButton,!1),e.globalElements.results.addEventListener("click",e.book,!1),e.globalElements.bookingConfirmed.addEventListener("click",e.bookingConfirmed,!1),e.globalElements.return.addEventListener("click",e.returnHome,!1)},peopleButtons:function(e){var t=$("#totalPpl")[0],a=parseInt(t.innerText);"plus"===e.target.id&&t.innerText<="5"?t.innerText=a+1:"minus"===e.target.id&&t.innerText>="2"&&(t.innerText=a-1)},searchButton:function(){var t=$("#pickLocation")[0].value,a=$("#pickDate").datepicker("getDate"),o=$("#dropDate").datepicker("getDate");$("#totalPpl")[0].innerText;$('[data-toggle="tooltip"]').tooltip("hide"),"Choose..."===t?$("#pickLocation").tooltip("show"):null===a?$("#pickDate").tooltip("show"):null===o?$("#dropDate").tooltip("show"):e.compareDates(a,o)>16?$("#dropDate").attr("title","Max of fifteen days").tooltip("_fixTitle").tooltip("show"):($('[data-toggle="tooltip"]').tooltip("hide"),e.getResults())},compareDates:function(e,t){var a=new Date(e),o=new Date(t).getTime()-a.getTime();return Math.ceil(o/864e5)},getResults:function(){"fail"===e.validation()?$("#noVehModal").modal("show"):($(".home").addClass("displayNone"),$(".results").removeClass("displayNone"),e.mapLocation())},validation:function(){$("#pickLocation")[0].value,$("#dropLocation")[0].value;var t=$("#pickDate").datepicker("getDate"),a=$("#dropDate").datepicker("getDate"),o=$("#totalPpl")[0].innerText;e.globalElements.diffDays=e.compareDates(t,a);for(var n=e.globalElements.diffDays,i=[],l=0;l<data.length;l++){var r=data[l].type,s=data[l].img;if(data[l].mixSeat<=o&&data[l].maxSeat>=o&&data[l].minDay<=n&&data[l].maxDay>=n){e.globalElements.vehicleOptions.push(r);var d='<div class="section result row">';d+='<div class="col-8">',d+='<h3 class="title">'+r+"</h3>",d+='<p class="stats">Manual<br />$<span class="dayPrice">'+data[l].price+"</span> per day<br />"+data[l].fuelKm+"L / 100km<br />",d+='<span class="sideNote">View Pricing Chart for estimated total cost</span></p>',d+='<div class="statPeople">',d+='<h5 class="numberPpl">'+data[l].mixSeat+"-"+data[l].maxSeat+"</h5>",d+='<i class="fas fa-user"></i>',d+="</div></div>",d+='<div class="col-4 iconButton">',d+='<img class="icon" src="img/'+s+'.svg" alt="'+r+'">',d+='<button class="btn btn-outline-secondary greeenButton pBottom" >Book</button>',d+="</div></div>",e.globalElements.topper.insertAdjacentHTML("afterend",d)}else i.push(r)}return 4===i.length?"fail":"pass"},mapLocation:function(){var t=$("#pickLocation")[0].value,a=$("#dropLocation")[0].value;"0"===a&&(a=t);var o=geojson[t].coordinates,n=geojson[a].coordinates;mapboxgl.accessToken="pk.eyJ1IjoiY2F0aGV5MTkxIiwiYSI6ImNqaTNtb2o1ODAwNjgzcHF0ZWQxdmVtcTcifQ.BaXfgHPABUk6-kMMyyMNXQ";var i=new mapboxgl.Map({container:"map",style:"mapbox://styles/cathey191/cji3oxshg1lt72rkzkj9i7c0m",center:[172,-41.279],zoom:3});i.on("load",function(){var t="https://api.mapbox.com/directions/v5/mapbox/driving/"+o[0]+","+o[1]+";"+n[0]+","+n[1]+"?geometries=geojson&access_token="+mapboxgl.accessToken;$.ajax({method:"GET",url:t}).done(function(t){var a=t.routes[0].geometry;e.globalElements.distance=t.routes[0].distance/1e3,e.pricing(),i.addLayer({id:"route",type:"line",source:{type:"geojson",data:{type:"Feature",geometry:a}},paint:{"line-width":2}}),i.addLayer({id:"start",type:"circle",source:{type:"geojson",data:{type:"Feature",geometry:{type:"Point",coordinates:o}}}}),i.addLayer({id:"end",type:"circle",source:{type:"geojson",data:{type:"Feature",geometry:{type:"Point",coordinates:n}}}})})})},pricing:function(){for(var t=e.globalElements.vehicleOptions,a=[],o=e.globalElements.distance/100,n=[],i=0;i<data.length;i++)for(var l=data[i].type,r=0;r<t.length;r++)l===t[r]&&(a.push(data[i].price),n.push(data[i].fuelKm));e.multiArray(a,e.globalElements.diffDays),e.multiArray(n,o),e.multiArray(n,2),e.globalElements.price=a,e.globalElements.fuelKm=n,e.chart()},chartButton:function(){$("#mapChart")[0];"Pricing Chart"===$("#buttonText")[0].innerHTML?($("#mapDiv").addClass("displayNone"),$("#chartDiv").removeClass("displayNone"),$("#buttonText").text("View Map")):($("#chartDiv").addClass("displayNone"),$("#mapDiv").removeClass("displayNone"),$("#buttonText").text("Pricing Chart"))},chart:function(){var t=document.getElementById("chart").getContext("2d");new Chart(t,{type:"bar",data:{labels:e.globalElements.vehicleOptions,datasets:[{label:"Total Days",data:e.globalElements.price,backgroundColor:"#94C0E7",borderColor:"#e2f4f6",borderWidth:1},{label:"Fuel Cost",data:e.globalElements.fuelKm,backgroundColor:"#3c77a8",borderColor:"#e2f4f6",borderWidth:1}]},options:{legend:{labels:{fontColor:"#e2f4f6",fontSize:15}},title:{display:!0,fontColor:"#e2f4f6",fontSize:16,fontWeight:300,text:"Cost of Vehicle Rental in NZD"},scales:{yAxes:[{ticks:{fontColor:"#e2f4f6",fontSize:12,beginAtZero:!0},stacked:!0}],xAxes:[{ticks:{fontColor:"#e2f4f6",fontSize:12},stacked:!0}]},plugins:{datalabels:{color:"#2f3b3b",display:function(e){return e.dataset.data[e.dataIndex]>15},font:{weight:"bold"},formatter:Math.round}}}})},multiArray:function(e,t){$.each(e,function(a,o){e[a]=Math.ceil(o*t)})},returnHome:function(){e.globalElements.distance=0,e.globalElements.diffDays=0,e.globalElements.vehicleOptions=[],$("#chartDiv").addClass("displayNone"),$("#mapDiv").removeClass("displayNone"),$("#buttonText").text("Pricing Chart"),$(".result").remove(),$(".results").addClass("displayNone"),$(".home").removeClass("displayNone")},book:function(t){if("btn"===t.target.classList[0]){var a=t.target.parentElement.parentNode.children[0],o=a.childNodes[0].innerText,n=a.children[1].children[1].innerHTML,i=parseInt(n)*e.globalElements.diffDays,l=$("#dropLocation")[0].value;0==$("#dropLocation")[0].value&&(l=$("#pickLocation")[0].value),$("#bookModalLabel").text("New Booking For a "+o),$("#modalPick").text($("#pickDate")[0].value+" at 2pm, from "+$("#pickLocation")[0].value),$("#modalDrop").text($("#dropDate")[0].value+" at 10am, from "+l),$("#modalPrice").text("NZD "+i),$("#bookModal").modal("show")}},bookingConfirmed:function(){""===$("#bookingName")[0].value?$("#bookingName").tooltip("show"):""===$("#bookingEmail")[0].value?$("#bookingEmail").tooltip("show"):""===$("#bookingPhone")[0].value?$("#bookingPhone").tooltip("show"):(e.globalElements.distance=0,e.globalElements.diffDays=0,e.globalElements.vehicleOptions=[],$(".result").remove(),$(".results").addClass("displayNone"),$(".home").removeClass("displayNone"),$("#bookModal").modal("hide"),$("#bookingMade").modal("show"))}};e.eventListener();var t=$("#pickDate").datepicker({dateFormat:"dd/mm/yy",defaultDate:0,minDate:0,numberOfMonths:1}).on("change",function(){a.datepicker("option","minDate",o(this))}),a=$("#dropDate").datepicker({dateFormat:"dd/mm/yy",defaultDate:0,minDate:0,numberOfMonths:1}).on("change",function(){t.datepicker("option","maxDate",o(this))});function o(e){var t;$("#"+e.id).datepicker({dateFormat:"mm/dd/yy"});try{t=$.datepicker.parseDate("dd/mm/yy",e.value)}catch(e){t=null}return t}});