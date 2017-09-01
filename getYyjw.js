/**
 * Created by Freed on 2017/9/1.
 * E-mail:flyxz@126.com.
 * GitHub:FreedGo@github.com.
 */
const fs = require('fs');
const http = require('http');
let chapterNum = 1; //控制循环

let lastChapter = '38692140_2';//最终章节

let NextChapter = '5768909';//初始章节

let chapterTitle = {
	name :'',
	isWriteFile:false
};//因为一章被分成三段，用以三个章名合一

let oldText = '';

function getChapter(chapter){
	//发送请求数据
	let params = 'bookId=342974&chapterId='+chapter+'&v=1504248913910';

	http.get('http://m.zongheng.com/h5/ajax/chapter?'+params,(res)=>{
		let rawData= '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
			//转化为对象
			rawData = JSON.parse(rawData);
			//处理重复章节头
			if (chapterTitle.name != rawData.result.chapterName){
				chapterTitle.name = rawData.result.chapterName;
				chapterTitle.isWriteFile = true;
			}else {
				chapterTitle.isWriteFile = false
			}
			//读取原内容，防止覆盖
			oldText = fs.readFileSync('yyjw.txt','utf8');
			// 写入文件
			fs.writeFile(
				'yyjw.txt',
				oldText+(chapterTitle.isWriteFile? chapterTitle.name.replace(/(章)|(\s)/g,function(macth,p1,p2){
						if (p1) return '第';
						if (p2) return '章\r\n';
						 }):'')+rawData.result.content.replace(/(（本章未完，请翻页）)|(（本章完）|(\<p\>)|(\<\/p\>))/g,function(macth,p1,p2){
					if (p1) return '';
					if (p2) return '';
					if (p3) return '';
					if (p4) return '\r\n';
				}),
				'utf8',
				res => {
					console.log(chapterNum);
					chapterNum++;
					if (rawData.result.nextChapterId != lastChapter){
						setTimeout(function(){
							getChapter(rawData.result.nextChapterId)
							},1000);
					}
			});
		});
	});
}
getChapter(NextChapter);


