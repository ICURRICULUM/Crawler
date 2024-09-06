const { getData } = require('./lib/getData');
const { createCurriculumData } = require('./bin/utils/util');

// aws 람다 핸들러 작성, 핸들러 부분이 호출.

/**
  departmentName 
  joinYear
 */

exports.handler = async (event) => {
    try {
        const deptName = event.queryStringParameters.departmentName;
        const year = event.queryStringParameters.joinYear;

        if (!deptName || !year) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: '학과와 년도를 입력해주세요.' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type', // 허용할 헤더
                },
            };
        }

        // 데이터 가져오기 및 가공
        const results = await getData(deptName, year);
        
        // 원하는 데이터로 폼 수정
        const resultData = createCurriculumData(results);

        return {
            statusCode: 200,
            body: JSON.stringify(resultData),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
                
            },
        };
    } catch (error) {
        console.error('크롤링 중 오류가 발생하였습니다:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: '서버 오류가 발생했습니다.' }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }
};
