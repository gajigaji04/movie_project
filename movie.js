//html 태그를 dom을 이용해서 변수에 저장
const $post_div1 = document.querySelector('#post-div1');
const $search_input = document.querySelector('#search-input');
const $search_btn = document.querySelector('#search-btn');
const $h1 = document.querySelector('#h1');
const $modal = document.querySelector('#modal');

//영화카드를 화면에 보여주도록 실행
posting();

//페이지에 접속을 하거나 새로고침을 할 때 영화 검색을 하는 input창에 커서가 자동을 가도록 focus를 줌
$search_input.focus();

//영화 검색을 하고 enter를 눌렸을 때 버튼 클릭과 동일한 효과를 주기위해 이벤트를 부여함
$search_input.addEventListener('keyup', e => {
    //키보드 enter를 누르면 실행
    if (e.code === 'Enter') {
        //영화 검색이 되지 않을 때 alert창이 뜨는데
        //그 때 alert창을 끄기 위해 enter를 누르면 input창 커서와 겹쳐서 alert창이 종종 두 번 뜨게 되는 걸
        //막기 위해서 enter 입력 시 커서를 끔
        //근데 사실 없어도 크게 지장은 없음...
        $search_input.blur();

        //enter를 누르면 버튼을 클릭 함으로써 같은 기능을 하도록 함
        $search_btn.click();
    }
});

//메인 페이지의 '최고 평점 영화 컬렉션'을 누르면 페이지가 새로고침 되게 함
$h1.addEventListener('click', e => {
    window.location.reload();
});

//검색 input창에 찾고자 하는 영화 이름을 입력 후
//버튼을 클릭 시 해당 이름을 포함한 영화만 보여주는 이벤트를 발생시킴
$search_btn.addEventListener('click', async e => {
    //메인 페이지에 존재하는 영화들은 getMoviesList함수에서 가져온 값들이기 때문에
    //검색한 영화와 일치하는 영화가 있는지 비교하기 위해서 getMoviesList함수로 영화 정보를 가져옴
    //값을 가져올 때까지 다른 코드를 실행하지 않기 위해서 await를 사용함
    const moviesList = await getMoviesList();
    //검색한 영화가 존재한다면 그 영화와 일치하는 영화카드 div만을 보여주여야 하기 때문에
    //각각의 영화카드 div가 필요한데 그 div는 동적으로 만들어지기 때문에 각 태그를 그대로 가져올 수가 없다.
    //그래서 그 div들을 감싸는 부모 div를 가져오고 그 자손값을 가져오면 각 영화카드 div에 접근할 수 있다.
    //.childNodes를 사용하면 Nodelist라는 객체로 정보가 담기는데 이 객체는 배열 메서드를 사용할 수 없어서 Array.from을 사용
    const post_div2_list = Array.from($post_div1.childNodes);

    //입력창에 아무값도 없이 버튼을 클릭하면 alert창이 뜸
    if (!$search_input.value) {
        alert('영화 제목을 입력하시오.');

        //alert창을 끈 후 페이지는 새로고침이 되는 것이 아니기 때문에 input에 포커스를 다시 줌
        $search_input.focus();
    } else { //입력창에 값이 있다면 실행
        //input에 입력한 영화 제목이 화면에 보여지는 20개의 영화와 일치하는지를 확인
        //find로 단 한개라도 존재한다면 실행
        //공백을 모두 제거해서 검사, 기본적으로 한국어로 영화를 보여주지만 한국에서 개봉하지 않은 영화는 제목이 영어로 되어있어서 
        //그럴 경우 문자열을 모두 소문자로 바꿔서 검사를 진행한다. 한국어는 소문자 대문자가 없어서 toLowerCase()가 있어도 아무런 작동도 하지 않는다.
        if (moviesList.find(item => item['movie_title'].toLowerCase().replace(/\s/g, '').includes($search_input.value.toLowerCase().replace(/\s/g, '')))) {
            //일치한느 영화가 있으면 일단 모든 영화카드를 숨김
            for (let i of post_div2_list) {
                i.style.display = 'none';
            }

            //그 후 일치하는 영화만 display = block으로 보여줌
            //검사를 위에서 했는데 또 하는 이유는 위에서는 단 하나라도 일치하는지를 판단하기 위해서 했던 검사이고
            //지금의 검사는 일치하는 영화를 보여주어야 하는데 그 값이 두 개 이상일 수 있기 때문에 모든 값들을 확인 후 일치하는 값들을 모두 보여주도록 하기 위한 검사이다.
            for (let movie of moviesList) {
                if (movie['movie_title'].toLowerCase().replace(/\s/g, '').includes($search_input.value.toLowerCase().replace(/\s/g, ''))) {
                    //영화카드 div의 id값은 각 영화의 id값과 동일하기 때문에
                    //일치하는 값이 있을 때마다 영화카드의 div와 비교후 일치한다면 카드를 보여준다.
                    const post_div2 = post_div2_list.find(div => +div.id === movie['movie_id']);

                    post_div2.style.display = 'block';
                }
            }

            //카드가 보여지고 숨겨지는 것은 새로고침이 되지는 않기 때문에 포커스를 다시 준다.
            $search_input.focus();
        } else { //input창에 입력한 값이 존재하지 않는다면 alert창을 띄움
            alert('일치하는 영화가 없습니다.');

            //페이지가 새로고침 되는 것은 아니기 때문에 포커스를 다시 준다.
            $search_input.focus();
        }
    }
});

//tmdb에 접속해서 top rated 영화 20개를 가져오는 함수
//각 나라별로 영화 정보를 가져오기 위해서 각 나라의 이름을 담은 language를 매개변수로 받음 
async function respondApi(language) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGRkOWQyYWVhMzc4ZTA4NTVhZjM3YzQzMDBiMTcxYiIsInN1YiI6IjY0NzM0NDkwYTE5OWE2MDBkYzRjYjk3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._SbUcrThmlbJYXmIZfzbzJZmIUVqhuFVIoXK5mJmMHw'
        }
    };

    //서버에 접속해서 영화 정보 api를 받아옴
    //정보를 다 받을 때 까지 다른 코드를 실행하지 않고 기다리게 하기 위해서 await를 사용
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=${language}&page=1`, options).then(response => response.json());
    //서버로부터 받은 api중 필요한 값들은 results에 있기 때문에 그 부분만 추출 
    const moviesInfo = response['results'];

    return moviesInfo;
}

//tmdb에서 가져온 영화정보를 필요한 값만 추출해서 객체형태로 배열에 저장해주는 함수
async function getMoviesList() {
    //영화 정보를 받아와서 변수에 저장
    //한국어로 영화를 받아옴
    //서버로 부터 api를 받고 필요한 값만 가져오는 동안 다른 코드를 실행시키지 않기 위해서 await를 사용
    const moviesInfo = await respondApi('ko-KR');
    //받아온 영화 정보 중 필요한 값만 저장해줄 변수를 생성
    let moviesList = [];

    //필요한 값들만 따로 추출
    for (let movie of moviesInfo) {
        //영화 id
        const movie_id = movie['id'];
        //영화 포스트 이미지
        const movie_img = `https://image.tmdb.org/t/p/w200/${movie['poster_path']}`;
        //영화 제목
        const movie_title = movie['title'];
        //영화 줄거리
        //기본적으로 한국어로 영화를 받아왔는데 tmdb에서는 한국에서 개봉하지 않은 영화는 그 영화의 줄거리가 존재하지 않는 것 같다.
        //그래서 만약 줄거리가 존재하지 않는다면 getUsOverview함수로 영화 정보를 영어로 받아오고 줄거리가 없는 해당 영화의 id값을 인자롤 보내줌으로써
        //일치하는 영화의 줄거리만 따로 받아온다.
        const movie_overview = movie['overview'] ? movie['overview'] : await getUsOverview(movie['id']);
        //영화 평점
        const movie_voteAvg = movie['vote_average'];

        //추출한 정보들을 객체형태로 배열에 저장
        moviesList.push(
            {
                movie_id: movie_id,
                movie_img: movie_img,
                movie_title: movie_title,
                movie_overview: movie_overview,
                movie_voteAvg: movie_voteAvg
            }
        );
    }

    return moviesList;
}

//영화 줄거리가 한국어로 존재하지 않을 때 영어로 다시 받아오는 함수
async function getUsOverview(id) {
    //'en-US'로 영화 정보를 영화로 받아온다.
    //정보를 다 받아올 때 까지 await로 기다림
    const moviesInfo_Us = await respondApi('en-US');

    //영어로 받아온 정보 중에서 줄거리가 없는 영화의 id와 일치하는 값의 줄거리만 따로 return함
    for (let movie of moviesInfo_Us) {
        if (movie['id'] === id) {
            return movie['overview'];
        }
    }
}

//영화의 정보를 모달창으로 보여주는 함수
//영화의 정보들을 담은 item을 매게변수로 받음
function postingModal(item) {
    const $modal_body = document.createElement('div');
    const $modal_img = document.createElement('img');
    const $modal_title = document.createElement('p');
    const $modal_overview = document.createElement('p');
    const $modal_voteAvg = document.createElement('p');
    const $modal_header = document.createElement('div');
    const $modal_header_id = document.createElement('div');
    const $modal_close = document.createElement('div');

    //영화카드를 클릭할 때 마다 모달창이 아래에 붙어서 출력되는 상황이 생겨서
    //클릭 시 가장 먼저 모달창을 초기화 시킨다.
    $modal.innerHTML = '';

    //영화 포스트 이미지, 제목, 줄거리, 평점을 태그에 넣는다.
    $modal_img.src = item['movie_img'];
    $modal_title.innerText = item['movie_title'];
    $modal_overview.innerText = item['movie_overview'];
    $modal_voteAvg.innerText = `평점: ${item['movie_voteAvg']}`;

    //모달창 상단에 영화의 id값과 모달창을 닫을 수 있는 X를 생성
    $modal_header_id.innerText = `id: ${item['movie_id']}`;
    $modal_close.innerText = 'X';
    $modal_header_id.id = 'modal-id';
    $modal_close.id = 'modal-close';

    $modal_header.append($modal_header_id);
    $modal_header.append($modal_close);

    $modal_header.id = 'modal-header';

    $modal_img.id = 'modal-img';
    $modal_title.id = 'modal-title';
    $modal_overview.id = 'modal-overview';
    $modal_voteAvg.id = 'modal-voteAvg';

    $modal_body.id = 'modal-body';

    $modal_body.append($modal_header);
    $modal_body.append($modal_img);
    $modal_body.append($modal_title);
    $modal_body.append($modal_overview);
    $modal_body.append($modal_voteAvg);

    $modal.append($modal_body);
}

//영화카드를 화면에 보여주는 함수
async function posting() {
    //영화 정보를 받아오는 동안 다른 코드를 실행하지 않기 위해서 await를 사용
    const moviesList = await getMoviesList();

    //영화 정보를 forEach로 순환하면서 html 태그에 넣고 화면에 보여지도록 한다.
    moviesList.forEach(item => {
        //영화 줄거리와 평점은 따로 모달창에서 볼 수 있게 했다.
        //post_div2는 각 영화카드 정보를 담을 div이다.
        const $post_div2 = document.createElement('div');
        const $img = document.createElement('img');
        const $title = document.createElement('p');

        //각 영화카드를 누르면 모달창이 나오도록 이벤트를 부여함
        $post_div2.addEventListener('click', e => {
            //영화카드를 누르면 가장 먼저 alert창에 그 영화의 id값을 보여줌
            alert(`영화 id: ${item['movie_id']}`);
            //모달창이 화면에 보여지게 해주는 함수
            postingModal(item);

            //모달창이 화면엔 보여질 때 메인페이지의 스크롤이 움직이는 것을 막아준다.
            document.body.style.overflow = 'hidden';
            //원래는 숨겨져 있다가 클릭 시 보여지도록 한다.
            $modal.style.display = 'block';

            //모달창을 닫을 수 있는 X에 클릭 이벤트를 부여함
            const $modal_close = document.querySelector('#modal-close');

            $modal_close.addEventListener('click', e => {
                //X를 클릭 시 모달창을 닫음
                $modal.style.display = 'none';
                //모달창이 닫히면 메인페이지에서 없엔 스크롤을 다시 보여지게 함
                document.body.style.overflow = 'auto';
            })
        });

        //영화의 상세한 정보는 모달창에서 보여지기 때문에
        //기본적인 영화 포스트 이미지와 제목만 메인페이지에서 볼 수 있도록 함
        $img.src = item['movie_img'];
        $title.innerText = item['movie_title'];

        $title.className = 'title';

        $post_div2.id = `${item['movie_id']}`;
        $post_div2.className = 'post-div2';

        $post_div2.append($img);
        $post_div2.append($title);

        $post_div1.append($post_div2);
    })
}