/*
 * @Descripttion: 
 * @Author: pengpeng
 * @Date: 2021-04-06 09:24:09
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-06 09:42:41
 */
//rem px:rem 100:1
let rem = () => {
	let deviceWidth = document.documentElement.clientWidth,
		html = document.documentElement;

	if (deviceWidth > 1024) {
		deviceWidth = 1024;
		html.style.maxWidth = '1024px';
		html.style.margin = '0 auto';
	}
	html.style.fontSize = deviceWidth / 7.5 + 'px';
}

rem();
window.addEventListener("resize", () => {
	rem()
}, false);