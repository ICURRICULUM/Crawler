const axios = require("axios");
const cheerio = require("cheerio");

const curri_field = ["영역", "", "과목영역", "학수번호", "교과목명", "학점", "이수시기", "비고"];
const credit_field = ["총이수", "단일전공", "복수연계융합전공", "부전공"];

const getHtml = async (url) => {
    try {
        const html = await axios.get(`https://sugang.inha.ac.kr/sugang/SU_51001/${url}`);
        const $ = cheerio.load(html.data);
        const testData = {
            "필수이수학점": {},
            "교육과정": []
        };
        const tableCredit = $(`table[summary="조회목록"]`);
        tableCredit.find('tbody').each((index, element) => {
            const data = {
                "총필요학점": 130,
                "단일전공_필요학점": parseInt($(element).find('#lblJunCredit').text().trim(), 10),
                "복수_연계_융합_전공_필요학점": parseInt($(element).find('#lblPl1Credit').text().trim(), 10),
                "부전공_필요학점": parseInt($(element).find('#lblSub11Credit').text().trim(), 10)
            }
            testData.필수이수학점 = data;
        });

        const table1 = $('#gvCurriculum');
        table1.find('tr').each((index, element) => {
            const data = {};
            $(element).find('.Left').each((i, td) => {
                data[`${curri_field[i]}`] = $(td).text().trim();
            });
            if (Object.keys(data).length > 0) {
                testData.교육과정.push(data);
            }
        });

        return testData;
    } catch (error) {
        console.error(error);
        return [];
    }
};


// 원하는 년도 학과가 입력되었을 때 값을 가져오기
const getData = async (deptName, year) => {
    try {
        const results = [];  // results 변수 정의 및 초기화

        // 첫 번째 요청: 페이지를 로드하고 숨겨진 필드 값을 가져옵니다.
        const response = await axios.post('https://sugang.inha.ac.kr/sugang/SU_51001/curriculum_all.aspx');
        let $ = cheerio.load(response.data);

        // 숨겨진 필드 값 추출
        const viewState = $('#__VIEWSTATE').val();
        const eventValidation = $('#__EVENTVALIDATION').val();
        const viewStateGenerator = $('#__VIEWSTATEGENERATOR').val();

        console.log(year);

        // 폼 데이터 준비
        const formData = new URLSearchParams();
        formData.append('__EVENTTARGET', 'ddlYear');
        formData.append('__EVENTARGUMENT', '');
        formData.append('__VIEWSTATE', viewState);
        formData.append('__EVENTVALIDATION', eventValidation);
        formData.append('__VIEWSTATEGENERATOR', viewStateGenerator);
        formData.append('ddlYear', year.toString());

        // 두 번째 요청: 선택된 연도의 데이터를 가져옵니다.
        const postResponse = await axios.post('https://sugang.inha.ac.kr/sugang/SU_51001/curriculum_all.aspx', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Cookie': response.headers['set-cookie'].join('; ')  // 필요한 경우 Cookie 설정
            }
        });

        $ = cheerio.load(postResponse.data);
        const table1 = $('#gvList');

        // 각 연도별로 데이터를 수집합니다.
        const promises = [];

        table1.find('tbody tr').each((index, element) => {
            const $row = $(element);
            const findValue = `td:contains(${deptName})`;
            const $departmentTd = $row.find(findValue);

            if ($departmentTd.length > 0) {
                const curriculumUrl = $row.find('a').first().attr('href');
                const promise = getHtml(curriculumUrl).then(result => {
                    results.push({ year: year, course: result });
                });
                promises.push(promise);
            }
        });

        // 모든 비동기 작업이 완료될 때까지 기다립니다.
        await Promise.all(promises);

        return results;

    } catch (err) {
        console.error('Error fetching data:', err);
        return [];
    }
};

module.exports = {
    getData: getData
};
