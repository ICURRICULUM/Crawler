const fs = require('fs').promises;
const readline = require('readline')
const path = require('path');
const ExcelJS = require('exceljs');

const { getData } = require('../lib')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// json파일을 만들고싶을때 주석해제
// rl.question('학과를 입력해주세요 : ', async (deptName) => {
//     try {
//         const results = await getData(deptName); // 모든 연도별 작업이 완료된 결과를 받음
//         const resultData= createData(results);
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

rl.question('학과를 입력해주세요 : ', async (deptName) => {
    try {
        const results = await getData(deptName); // 모든 연도별 작업이 완료된 결과를 받음
        const resultData= createData(results);
        const dataFolderPath = path.join(__dirname, '../execlData');
        // 결과를 JSON 파일로 저장
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
      
        // 헤더(row) 추가
        const headers = Object.keys(resultData[0]);
        worksheet.addRow(headers);
      
        // 데이터(rows) 추가
        resultData.forEach(data => {
          const rowValues = Object.values(data);
          worksheet.addRow(rowValues);
        });
      
        // Excel 파일 저장
        const filePath = `${dataFolderPath}/${deptName}.xlsx`;
        await workbook.xlsx.writeFile(filePath);
        console.log(`${deptName}.xlsx 파일이 생성되었습니다.`);
        

    } catch (error) {
        console.error('파일 생성 중 오류가 발생하였습니다:', error);
    }
});



function createData(results) {
    let processedData = [];
    // 각 연도별로 처리
    results.forEach((entry, index) => {
        let year = entry.year;
        entry.course.forEach(course => {
            let { 영역, 학수번호, 교과목명, 학점, 이수시기 ,비고 } = course;
            let startYear = year; // 이수시기에서 숫자 추출
            let endYear= year;

            // 기존 데이터에 있는지 확인
            let existingCourse = processedData.find(item =>
                item.영역 === 영역 &&
                item.학수번호 === 학수번호 &&
                item.교과목명 === 교과목명 &&
                item.학점 === 학점 &&
                item.종료시기 === year-1
            );

            if (existingCourse) {
                    existingCourse.종료시기 = year;
            } else {
                // 기존 데이터에 없으면 새로 추가
                processedData.push({
                    영역,
                    학수번호,
                    교과목명,
                    학점,
                    이수시기,
                    비고: 비고,
                    시작시기: startYear,
                    종료시기: endYear
                });
            }
        });
    });
    return processedData;
}


