
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

function extractNumber(text) {
    const parts = text.split('-'); // '-' 기준으로 문자열을 나눔
    const retrunVal='핵심교양'+parts[1].charAt(0); // 숫자가 있는 위치에서 첫 문자를 가져옴
    return retrunVal;
}

function createCurriculumData(results) {
    const CurriculumList = [];

    results.forEach((entry, index) => {
        const YearCurriculumList = {
            year: '',
            "필수_이수학점": { // 총이수학점이 없으면 130 -> 변경

            },
            "교과과정": {
                "전공필수": [],
                "교양필수": [],
                "전공선택": []
            },
            "핵심교양": {
                "영역지정여부": false,
                "요구학점": 0,
                "필수영역": [],
                "지정과목": {
                    "핵심교양1": [],
                    "핵심교양2": [],
                    "핵심교양3": [],
                    "핵심교양4": [],
                    "핵심교양5": [],
                    "핵심교양6": []
                }
            },
            "SW_AI": {
                "과목_지정여부": false,
                "지정과목": [],
                "학점": 0
            },
            "창의": {
                "과목_지정여부": false,
                "지정과목": [],
                "학점": 0
            }
        };
        YearCurriculumList.필수_이수학점 = entry.course.필수이수학점;
        YearCurriculumList.year = entry.year;
        entry.course.교육과정.forEach((item) => {
            if (item.영역 === '전공선택') {
                YearCurriculumList.교과과정.전공선택.push({ "과목명": item.교과목명, "학수번호": item.학수번호 });
            } else if (item.영역 === '전공필수') {
                YearCurriculumList.교과과정.전공필수.push({ "과목명": item.교과목명, "학수번호": item.학수번호 });
            } else if (item.영역 === '교양필수') {
                if(item.교과목명.includes("핵심교양-")){
                    YearCurriculumList.핵심교양.필수영역.push(extractNumber(item.교과목명));
                }else{
                    YearCurriculumList.교과과정.교양필수.push({ "과목명": item.교과목명, "학수번호": item.학수번호 });
                }
            }
            console.log(item);
        });
        CurriculumList.push(YearCurriculumList);
    });

    return CurriculumList;
}

module.exports = {
    createCurriculumData: createCurriculumData
}