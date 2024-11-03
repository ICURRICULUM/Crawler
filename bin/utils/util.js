function extractNumber(text) {
    const parts = text.split('-'); // '-' 기준으로 문자열을 나눔
    const returnVal = '핵심교양' + parts[1].charAt(0); // 숫자가 있는 위치에서 첫 문자를 가져옴
    return returnVal;
}

function createCurriculumData(results) {
    const CurriculumArray = [];  // 배열로 변경

    results.forEach((entry) => {
        const YearCurriculum = {
            "alternativeCourse": {
                "대체과목코드": {}
            },
            "requiredCredit": {},
            "generalRequired": {
                "과목코드":[],
                "추가정보":{}
            },
            "majorRequired": {
                "과목코드":[],
                "추가정보":{}
            },
            "majorSelect": {
                "과목코드":[],
                "추가정보":{}
            },
            "core": {
                "영역_지정여부": true,
                "요구학점": 9,
                "필수영역": [],
                "영역별_지정과목": {},
                "영역별_대체과목": {},
                "추가정보":{}
            },
            "swAi": {
                "영역대체과목":[],
                "인정과목": [],
                "필요학점": 0,
                "추가정보":{}
            },
            "creativity": {
                "인정과목": [],
                "요구학점": 0,
                "추가정보": {}
            }
        };

        YearCurriculum.requiredCredit = entry.course.필수이수학점;

        entry.course.교육과정.forEach((item) => {
            if (item.영역 === '전공선택') {
                YearCurriculum.majorSelect.과목코드.push(item.학수번호);
            } else if (item.영역 === '전공필수') {
                YearCurriculum.majorRequired.과목코드.push(item.학수번호);
            } else if (item.영역 === '교양필수') {
                if (item.교과목명.includes("핵심교양-")) {
                    YearCurriculum.core.필수영역.push(extractNumber(item.교과목명));
                } else {
                    YearCurriculum.generalRequired.과목코드.push(item.학수번호);
                }
            }
        });

        CurriculumArray.push(YearCurriculum);
    });

    return CurriculumArray;
}

module.exports = {
    createCurriculumData: createCurriculumData
};
