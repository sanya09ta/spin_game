// กำหนดเวลาสุ่ม (ตั้งเป็น 1000 มิลลิวินาที = 1 วินาที)
var intervalTime = 600;
var score = 0;
var rotate_now = 30 ;
var rd = (360 * 20);
var spin_score = 25;
var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

console.log("ความกว้างของหน้าต่าง: " + screenWidth);
console.log("ความสูงของหน้าต่าง: " + screenHeight);

// ฟังก์ชันสุ่มระหว่าง 0 - ความกว้างจอ
function getRandomNumber() {
	return Math.floor(Math.random() * (screenWidth - 50));
}

var intervalId = setInterval(function() {
	randomItem();
}, intervalTime);

setTimeout(function() {
	//clearInterval(intervalId);
	//console.log("หยุดการทำงาน");
}, 10000);

function generateItemId() {
	var currentTime = new Date();
	var itemId = "item_" + currentTime.getTime(); // ใช้ getTime() เพื่อให้ได้ timestamp
	return itemId;
}
//สร้างตัวแปรคุกกี้
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
 }
 //ดึงตัวแปรคุก
 function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}
// ฟังก์ชันสร้าง item
function randomItem() {
	var x = getRandomNumber();
	var id=generateItemId();
	var t = Math.floor(Math.random() * 100)+1;
	var speed = Math.floor(Math.random() * 5 )+1;

	if (t <= 60) {
		$('#mainCanvas').append('<div id="'+id+'" class="item speed_0" style="left: '+x+'px"><img src="img/star2.png" draggable="false" data-score="1"></div>');
	}
	else {
		$('#mainCanvas').append('<div id="'+id+'" class="item speed_'+speed+'" style="left: '+x+'px"><img src="img/box10.png" draggable="false" data-score="10"></div>');
	}
	setTimeout(function() {
		$('#'+id).addClass('move');
	}, 50);
	setTimeout(function() {
		$('#'+id).remove();
	}, 10000);
}

// คลิก item เพื่อเก็บคะแนน
$('body').on('click', function(e){
	if ( $(e.target).is('.item img') ) {
		$(e.target).closest('.item').addClass('shake-image');
		setTimeout(function() {
			$(e.target).closest('.item').addClass('move-image').removeClass('move speed_0 speed_1 speed_2 speed_3 speed_4 speed_5');
		}, 50);
		setTimeout(function() {
			var sc = $(e.target).data('score')*1;
			score = score + sc;
			console.log(sc+' คะแนน');
			e.target.closest('.item').remove();
			$('#score').html(score);
			setCookie('score',score,365);
		},500);
	}
	else {
		console.log('ไม่โดน นิ_!!');
	}
})

if ( getCookie('score') !== undefined) {
	score = getCookie('score')*1;
	$('#score').html(score);
}

$('body').on('click','#spin',function(){
	if ( !$(this).hasClass('spinning') && score >= spin_score ) {
		$('#reward').html("...ขอให้โชคดี...");
		$(this).addClass('spinning');
		now = Math.floor(Math.random() * 330)+15;
		rotate_now = rotate_now + rd + now;
		
		// ลดคะแนนเมื่อหมุนวงล้อ
		score = score - spin_score;
		
		$('#score').html(score);
		setCookie('score',score,365);
		$(this).css('transform','rotate('+rotate_now+'deg)');
		setTimeout(function() {
			$('#spin').removeClass('spinning');
			//30 90 150 210 270 330 390
			now = rotate_now % 360;
			if ( now > 30 && now < 90 ) {
				award =  'ติดต่อรับรางวัลจาก Dream';
			}
			else if ( now > 150 && now < 210 ) {
				award =  'ติดต่อรับรางวัลจาก Zee';
			}
			else if ( now > 270 && now < 330 ) {
				award =  'ติดต่อรับรางวัลจาก Dear';
			}
			else {
				award =  'ไม่ได้รางวัล!';
			}
			$('#reward').html(award);
		}, 5000);
	}
})

$('.nav-top').append('<span>กดที่วงล้อ เมื่อต้องการรับรางวัล (ใช้คะแนน '+spin_score+' คะแนน/ครั้ง)</span>');
