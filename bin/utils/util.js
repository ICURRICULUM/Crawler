
// 시작 시기와 종료시기를 나타내고싶을때 주석해제
// function createData(results) {
//     let processedData = [];
//     // 각 연도별로 처리
//     results.forEach((entry, index) => {
//         let year = entry.year;
//         entry.course.forEach(course => {
//             let { 영역, 학수번호, 교과목명, 학점, 이수시기 ,비고 } = course;
//             let startYear = year; // 이수시기에서 숫자 추출
//             let endYear= year;

//             // 기존 데이터에 있는지 확인
//             let existingCourse = processedData.find(item =>
//                 item.영역 === 영역 &&
//                 item.학수번호 === 학수번호 &&
//                 item.교과목명 === 교과목명 &&
//                 item.학점 === 학점 &&
//                 item.종료시기 === year-1
//             );

//             if (existingCourse) {
//                     existingCourse.종료시기 = year;
//             } else {
//                 // 기존 데이터에 없으면 새로 추가
//                 processedData.push({
//                     영역,
//                     학수번호,
//                     교과목명,
//                     학점,
//                     이수시기,
//                     비고: 비고,
//                     시작시기: startYear,
//                     종료시기: endYear
//                 });
//             }
//         });
//     });
//     return processedData;
// }

function createCurriculumData(results) {
    const CurriculumList = [];
    
    results.forEach((entry, index) => {
        const YearCurriculumList={
            year:'',
            "필수이수학점":{

            },
            "교과과정": {
                     "전공필수_리스트": [],
                     "교양필수_리스트": [],
                     "전공선택_리스트": []
                   }
        };
        YearCurriculumList.필수이수학점=entry.course.필수이수학점;
        YearCurriculumList.year=entry.year;
        entry.course.교육과정.forEach((item) => {
            if (item.영역 === '전공선택') {
                YearCurriculumList.교과과정.전공선택_리스트.push({"과목명":item.교과목명,"학수번호":item.학수번호});
            } else if (item.영역 === '전공필수') {
                YearCurriculumList.교과과정.전공필수_리스트.push({"과목명":item.교과목명,"학수번호":item.학수번호});
            } else if (item.영역 === '교양필수') {
                YearCurriculumList.교과과정.교양필수_리스트.push({"과목명":item.교과목명,"학수번호":item.학수번호});
            }
            console.log(item);
        });
        CurriculumList.push(YearCurriculumList);
    });

    return CurriculumList;
}

module.exports={
    createCurriculumData:createCurriculumData
}