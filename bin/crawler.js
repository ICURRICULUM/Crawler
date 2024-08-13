const fs = require('fs').promises;
const readline = require('readline')
const path = require('path');
const ExcelJS = require('exceljs');
const {createCurriculumData}=require('./utils/util');

const { getData } = require('../lib');
const { connected } = require('process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// json파일을 만들고싶을때 주석해제
// rl.question('학과를 입력해주세요 : ', async (deptName) => {
//     try {
//         const results = await getData(deptName); // 모든 연도별 작업이 완료된 결과를 받음
//         console.log(results);
//         const resultData= createCurriculumData(results);
//         console.log(resultData);
//         const dataFolderPath = path.join(__dirname, '../data');
//         // 결과를 JSON 파일로 저장
//         const jsonData = JSON.stringify(resultData, null, 2);
//         await fs.writeFile(`${dataFolderPath}/${deptName}.json`, jsonData);
//         console.log(`${deptName}.json 파일이 성공적으로 생성되었습니다.`);

//     } catch (error) {
//         console.error('파일 생성 중 오류가 발생하였습니다:', error);
//     } finally {
//         rl.close();
//     }

// });

// excel 파일을 만들고싶을때 주석해제

// rl.question('학과를 입력해주세요 : ', async (deptName) => {
//     try {
//         const results = await getData(deptName); // 모든 연도별 작업이 완료된 결과를 받음
//         const resultData= createCurriculumData(results);
//         const dataFolderPath = path.join(__dirname, '../execlData');
//         // 결과를 JSON 파일로 저장

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Sheet 1');

//         // 헤더(row) 추가
//         const headers = Object.keys(resultData[0]);
//         worksheet.addRow(headers);

//         // 데이터(rows) 추가
//         resultData.forEach(data => {
//           const rowValues = Object.values(data);
//           worksheet.addRow(rowValues);
//         });

//         // Excel 파일 저장
//         const filePath = `${dataFolderPath}/${deptName}.xlsx`;
//         await workbook.xlsx.writeFile(filePath);
//         console.log(`${deptName}.xlsx 파일이 생성되었습니다.`);


//     } catch (error) {
//         console.error('파일 생성 중 오류가 발생하였습니다:', error);
//     }
// });


async function createJson(req, res){
    try {
        const deptName= decodeURIComponent(req.params.depertment);
        const results = await getData(deptName); // 모든 연도별 작업이 완료된 결과를 받음
        console.log(results);
        const resultData= createCurriculumData(results);
        console.log(resultData);
        const dataFolderPath = path.join(__dirname, '../data');
        // 결과를 JSON 파일로 저장
        const jsonData = JSON.stringify(resultData, null, 2);
        await fs.writeFile(`${dataFolderPath}/${deptName}.json`, jsonData);
        console.log(`${deptName}.json 파일이 성공적으로 생성되었습니다.`);
        res.send(jsonData);
    } catch (error) {
        console.error('파일 생성 중 오류가 발생하였습니다:', error);
        res.status(500);
        res.send(error);
    }
}

module.exports={
    createJson:createJson
}