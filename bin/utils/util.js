function extractNumber(text) {
    const parts = text.split('-'); // '-' 기준으로 문자열을 나눔
    const returnVal = '핵심교양' + parts[1].charAt(0); // 숫자가 있는 위치에서 첫 문자를 가져옴
    return returnVal;
}

function createCurriculumData(results) {
    const CurriculumArray = [];  // 배열로 변경

    results.forEach((entry) => {
        const YearCurriculum = {
            "alternativeCourseJson": {
                "alternativeCourseMap": {}
            },
            "requiredCreditJson": {},
            "curriculumCodesJson": {
                "교과과정": {
                    "전공필수": [],
                    "교양필수": [],
                    "전공선택": []
                }
            },
            "coreJson": {
                "영역_지정여부": false,
                "요구학점": 0,
                "필수영역": [],
                "영역별_지정과목": {},
                "영역별_대체과목": {}
            },
            "swAiJson": {
                "과목_지정여부": false,
                "지정과목": [],
                "대체과목": [],
                "요구학점": 0
            },
            "creativityJson": {
                "과목_지정여부": false,
                "지정과목": [],
                "요구학점": 0
            }
        };

        YearCurriculum.requiredCreditJson = entry.course.필수이수학점;

        entry.course.교육과정.forEach((item) => {
            if (item.영역 === '전공선택') {
                YearCurriculum.curriculumCodesJson.교과과정.전공선택.push(item.학수번호);
            } else if (item.영역 === '전공필수') {
                YearCurriculum.curriculumCodesJson.교과과정.전공필수.push(item.학수번호);
            } else if (item.영역 === '교양필수') {
                if (item.교과목명.includes("핵심교양-")) {
                    YearCurriculum.coreJson.필수영역.push(extractNumber(item.교과목명));
                } else {
                    YearCurriculum.curriculumCodesJson.교과과정.교양필수.push(item.학수번호);
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
