// 基本系

function check(){
    console.log(TrushList,BoxList);
}

function GenerateId(){
    return 'trush-' + Math.random().toString(36).substr(2,9);
}

window.addEventListener('load', () => {
    BoxListMake();
});


// ゴミ系

const TrushList = [];
const trushname = document.querySelector('#TrushName');

function TrushInputInTheList() {
    const inputname = document.querySelector('#TrashInputName');
    const inputnametrim = inputname.value.trim()
    if (!inputnametrim) return;
    const newtrush = {id: GenerateId(),name: '',description:''};
    TrushList.push(newtrush);
    TrushListMake();
    BoxCheckMake();
    console.log(TrushList);
    inputname.value = '';
}
    // <!-- poi効果音？ -->

function TrushListMake(){
    trushname.innerHTML = "";
    for(let i = 0; i < TrushList.length; i++){
        const TrushName = TrushList[i];
        const content = `<div class="TrushNameBox" data-trush-id="${TrushName.id}">
                            <p>${TrushName.id}</p>
                            <div class="BoxCheck ChangeThrowDisplay ChangeThrowHidden"></div>
                            <button class="ChangeThrowDisplay ChangeThrowHidden" onclick="BoxCheckCheck(event)">ゴミ箱に捨てる</button>
                            <button class="ChangeThrowDisplay ChangeThrowHidden" onclick="ChangeBox(event)">捨てるゴミ箱を変えない</button>
                            <button class="ChangeThrowDisplay ChangeThrowButton" onclick="NotChangeBox(event)">捨てるゴミ箱を変える</button>
                            <button onclick="deleteTrush('${TrushName.name}')">このゴミを消滅させる</button>
                            <button onclick="TrushNameChange('${TrushName.id}')">名前・説明を変える</button>
                        </div>`;
        trushname.insertAdjacentHTML('beforeend',content)
    }
}


function TrushNameChange(id){
    const trush_box = TrushList.find(tr => tr.id === id);
    if (!trush_box) return;
    const newname = prompt('新しい名前を入力してください。', trush_box.name);
    if (newname && newname !== trush_box.name) {
        trush_box.name = newname;
    }
    const newde = prompt('新しい説明を入力してください。入力しないままOKを押すと省略されます。', trush_box.description || '');
    if (newde !== null) trush_box.description = newde; 
    TrushListMake();
    BoxCheckMake();
    RecycledNameChange();
}


function deleteTrush(name){
    for (let i = 0; i < TrushList.length; i++)
    if (TrushList[i].name === name) {
        TrushList.splice(i,1);
        TrushListMake();
        BoxCheckMake();
        RecycledNameChange();
        break;
    }
}


function NotChangeBox(e){
    const trush_name_box = e.target.closest('.TrushNameBox');
    const throwdisplay = trush_name_box.querySelectorAll('.ChangeThrowDisplay');
    for(let i = 0; i < throwdisplay.length; i++){
        const throwdisplays = throwdisplay[i];
        throwdisplays.classList.remove('ChangeThrowHidden');
    }
    e.target.classList.add('ChangeThrowHidden')
}


function ChangeBox(e){
    const trush_name_box = e.target.closest('.TrushNameBox');
    const throwdisplay = trush_name_box.querySelectorAll('.ChangeThrowDisplay');
    for(let i = 0; i < throwdisplay.length; i++){
        const throwdisplays = throwdisplay[i];
        throwdisplays.classList.add('ChangeThrowHidden');
    }
    const notchangebox = trush_name_box.querySelector(".ChangeThrowDisplay[onclick*='NotChangeBox']");
    if(notchangebox){
        notchangebox.classList.remove('ChangeThrowHidden');
    }
}


function BoxCheckCheck(e){
    const trushnamebox = e.target.closest('.TrushNameBox');
    const trushname = trushnamebox.querySelector('p').textContent;
    const checkboxes = trushnamebox.querySelectorAll('input[name="BoxCheck"]');
    const allboxes = document.querySelectorAll('.NamedTrushBox');
    for(let i = 0; i < checkboxes.length; i++){
        const check_Box = checkboxes[i];
        if(check_Box.checked){
            const checked_Box = check_Box.value
            for(let j = 0; j < allboxes.length; j++){
                const box = allboxes[j];
                const boxname = box.querySelector('p').textContent;
                if (boxname === checked_Box) {
                    const checkedtrushnames = box.querySelector('.TrushNameInTheBox');
                    let duplicate = false;
                    const ExistingTrush = checkedtrushnames.querySelectorAll('.checkedcontent');
                    for(let k = 0; k < ExistingTrush.length; k++){
                        if(ExistingTrush[k].CheckedTrush === trushnamebox){
                            duplicate = true;
                            break;
                        }
                    }
                    if(!duplicate){
                        const content =document.createElement('div');
                        content.classList.add('checkedcontent');
                        content.innerHTML = `<p>${trushname}</p>
                                            <button onclick="deleteTrushInBox(event)">ゴミ箱から出す</button>
                                            <label class="small-label">
                                                <input type="checkbox" class="ForRecycle" checked>このゴミからリサイクルする
                                            </label>`;
                        content.CheckedTrush = trushnamebox;
                        checkedtrushnames.appendChild(content);
                    }
                }
            }
        }
    }
    const Tohide = trushnamebox.querySelectorAll('.ChangeThrowDisplay');
    for(let i = 0; i < Tohide.length; i++){
        const tohide = Tohide[i];
        tohide.classList.add('ChangeThrowHidden');
    }
    const CTB = trushnamebox.querySelector('.ChangeThrowButton');
    if(CTB) CTB.classList.remove('ChangeThrowHidden');
}


function deleteTrushInBox(e) {
    const CheckedContent = e.target.closest('.checkedcontent');
    if (!CheckedContent) return;
    const namedbox = CheckedContent.closest('.NamedTrushBox');
    const boxName = namedbox.querySelector('p').textContent;
    const checkedTrush = CheckedContent.CheckedTrush;
    if(checkedTrush){
        const Check_boxes = checkedTrush.querySelectorAll('input[name="BoxCheck"]');
        for(let j = 0; j < Check_boxes.length; j++){
            if(Check_boxes[j].value === boxName){
                    Check_boxes[j].checked = false;
            }
        }
    }
    CheckedContent.remove();
}


// ゴミ箱系

const BoxList = [{id: GenerateId(),name:'基本ゴミ箱',description:''}];
const boxlist = document.querySelector('#BoxList');


function BoxInputInTheList() {
    const inputvalue = document.querySelector('#BoxInputName').value;
    if (inputvalue !== "") {
        BoxList.push({id: GenerateId(),name: inputvalue,description:''});
        BoxListMake();
        TrushListMake();
        BoxCheckMake();
        console.log(BoxList);
        document.querySelector('#BoxInputName').value = "";
    }
}

function BoxListMake(){
    boxlist.innerHTML = "";
    for(let i = 0; i < BoxList.length; i++){
            const BoxName = BoxList[i];
            const listcontent = `<div class="NamedTrushBox" data-trush-id="${BoxName.id}">
                                    <p>${BoxName.name}</p>
                                    <div class="TrushNameInTheBox"></div>
                                    <div class="RecycleAcions">
                                        <button onclick="RecycleAcion('${BoxName.id}')">このゴミ箱からリサイクル</button>
                                    </div>
                                    <button onclick="deleteBox('${BoxName.name}')">このゴミ箱を削除する</button>
                                    <button onclick="BoxNameChange('${BoxName.id}')">名前・説明を変える</button>
                                </div>`;
            boxlist.insertAdjacentHTML('beforeend',listcontent);
    }
}

function BoxCheckMake(){
    const boxcheck = document.querySelectorAll('.BoxCheck');
    for(let j = 0; j < boxcheck.length; j++){
        const box_check = boxcheck[j];
        const trush_Name = box_check.closest('.TrushNameBox').querySelector('p').textContent;
        box_check.innerHTML = "";
        for(let i = 0; i < BoxList.length; i++){
            const BoxName = BoxList[i];
            const Checked_boxes = Array.from(document.querySelectorAll('.NamedTrushBox')).some(box => {
                return box.querySelector('p').textContent === BoxName && 
                Array.from(box.querySelectorAll('.checkedcontent p')).some(p => p.textContent === trush_Name);
            });
            const checkcontent = `<label><input type="checkbox" value="${BoxName.name}" name="BoxCheck" ${Checked_boxes ? 'checked' : ''}>${BoxName.name}</label>`;
            box_check.insertAdjacentHTML('beforeend',checkcontent);
        }
    }
}


function deleteBox(name){
    for (let i = 0; i < BoxList.length; i++)
    if (BoxList[i].name === name) {
        BoxList.splice(i,1);
        BoxListMake();
        TrushListMake();
        BoxCheckMake();
        break;
    }
}


function BoxNameChange(id){
    const NamedBox = BoxList.find(box => box.id === id);
    if (!NamedBox) return;
    const Newname = prompt('新しい名前を入力してください。', NamedBox.name);
    if (Newname && Newname !== NamedBox.name) {
        NamedBox.name = Newname;
    }
    const newDe = prompt('新しい説明を入力してください。入力しないままOKを押すと省略されます。', NamedBox.description || '');
    if (newDe !== null) NamedBox.description = newDe; 
    BoxListMake();
    TrushListMake();
    BoxCheckMake();
    RecycledNameChange();
}


// リサイクル系

const RecycledList = [];
const recycledlist = document.querySelector('#RecycledList');


function RecycleAcion(SelectedBoxId){
    const namedboxes = Array.from(document.querySelectorAll('.NamedTrushBox'));
    const selectedbox = namedboxes.find(box => box.id === SelectedBoxId);
    if (!selectedbox) return;
    const selectedTrushes = [];
    const checkedcontents = selectedbox.querySelectorAll('.checkedcontent');
    for(let i = 0; i < checkedcontents.length; i++){
        const checked_content = checkedcontents[i];
        const cb = checked_content.querySelector('.ForRecycle');
        if (cb && cb.checked){
            selectedTrushes.push(checked_content.querySelector('p').textContent);
        }
    }
    if (selectedTrushes.length === 0) {
        alert('リサイクル元として選択されたゴミがありません。ゴミを選択してください。');
        return;
    }
    const newcontentname = prompt('リサイクルで生まれたものの名前を入力してください。');
    if(!newcontentname) return;
    const newcontentdescription = prompt('リサイクルで生まれたものの説明を入力してください。入力しないままOKを押すと省略されます。');
    const recycled = {id: GenerateId(), name: newcontentname, description: newcontentdescription, sourcetrush: selectedTrushes, sourceboxid: SelectedBoxId};
    RecycledList.push(recycled);
    RecycledNameChange();
}


function RecycledNameChange(){
    recycledlist.innerHTML = '';
    for(let i = 0; i < RecycledList.length; i++){
        Rcyed = RecycledList[i];
        const sourcetrushes = Rcyed.sourcetrush.map(id => {
            const tr = TrushList.find(trtr => trtr.id === id);
            return tr ? tr.name : `元：${id}`;
        }).join(',');
        const rcycontent = `<div class="RecycledContent" data-id="${Rcyed.id}">
                                <div class="RecycledContentName">${Rcyed.name}：${Rcyed.description}</div>
                                <div class="RecycledContentName">元のゴミ：${sourcetrushes}</div>
                                <div class="RecycledContentName">元のゴミが入っているゴミ箱：${(BoxList.find(b => b.id === Rcyed.sourceboxid)?.name) || `元：${Rcyed.sourceboxid}`}</div>
                                <button onclick="EditRecycled(${Rcyed.id})">名前・説明を変える</button>
                            </div>`;
        recycledlist.insertAdjacentHTML('beforeend',rcycontent);
    }
}


function EditRecycled(id){
    const RED = RecycledList.find(I => I.id === id);
    if (!RED) return;
    const Rednewname = prompt('新しい名前を入力してください。', RED.name);
    if (Rednewname) RED.name = Rednewname;
    const Rednewde = prompt('新しい説明を入力してください。入力しないままOKを押すと省略されます。', RED.description);
    if (Rednewde !== null) RED.description = Rednewde;
    RecycledNameChange();
}


// 説明系

const Pagestext = [
    {title:'No.1　《説明書の読み方》' ,text:'左半分に説明文を、右半分に説明用の画像を表示しています。→が書かれているボタンを押すと次のページに、←が書かれているボタンを押すと前のページに移ります。最後のページと最初のページは繋がっている様になっています。'},
    {title:'No.2　《頭の中のゴミを捨てる》' ,text:'「頭の中のゴミの名前」と書かれている枠をクリックして、捨てたい頭の中のゴミの名前を入力します。入力した後に「捨てる」ボタンを押すと、【ゴミリスト】の下にゴミが追加されます。'},
    {title:'No.3　《ゴミをゴミ箱に捨てる》' ,text:'「捨てるゴミ箱を変える」ボタンを押すと、【ゴミ箱リスト】にあるゴミ箱の名前が右に書かれたチェックボックスが出てきます。捨てたい先のゴミ箱の名前が付いたチェックボックスをクリックしてチェックした後に「ゴミ箱に捨てる」ボタンを押すと、そのゴミ箱の中にゴミが追加されます。「捨てるゴミ箱を変えない」ボタンを押すと、そのまま「捨てるゴミ箱を変える」が出ていた状態に戻ります。'},
    {title:'No.4　《ゴミの名前・説明編集　削除》' ,text:'「このゴミを消滅させる」ボタンを押すと、そのゴミが消滅します。\n「名前・説明を変える」ボタンを押すと、「新しい名前を入力してください。」と書かれた欄が出てきます。そこに新しい名前や説明文を入力したらOKボタンを押してください。名前や説明文が変更されます。'},
    {title:'No.5　《ゴミ箱の配置》' ,text:'「ゴミ箱の名前」と書かれている枠をクリックして、ゴミ箱の名前を入力します。入力した後に「ゴミ箱を追加する」ボタンを押すと、【ゴミ箱リスト】の下にゴミ箱が追加されます。'},
    {title:'No.6　《ゴミ箱の名前・説明編集　削除》' ,text:'「このゴミ箱を削除する」ボタンを押すと、そのゴミ箱が削除されます。\n「名前・説明を変える」ボタンを押すと、「新しい名前を入力してください。」等と書かれた欄が出てきます。そこに新しい名前や説明文を入力したらOKボタンを押してください。名前や説明文が変更されます。'},
    {title:'No.7　《リサイクルで新しいものを作る》' ,text:'「このゴミ箱からリサイクル」ボタンを押すと、「このゴミからリサイクルする」と右に書かれているチェックボックスにチェックされているゴミを用いて新たなものを作り出します。その新たなものの名前とそれについての説明を入力してください。（説明の有無は任意です。）入力してそれぞれOKボタンを押すと、それが【リサイクルによって生まれたものリスト】の下に追加されます。そのゴミ箱に入っているそのゴミ箱にゴミが入っていない状態ではリサイクルできません。'},
    // {title:'No.8　《作ったものの名前・説明編集　削除》' ,text:'「このゴミ箱を削除する」ボタンを押すと、そのゴミ箱が削除されます。\n「名前・説明を変える」ボタンを押すと、「新しい名前を入力してください。」等と書かれた欄が出てきます。そこに新しい名前や説明文を入力したらOKボタンを押してください。名前や説明文が変更されます。'},
];
const PagesImg = [,.../img/2.jpg,.../img/3.jpg,.../img/4.jpg,.../img/5.jpg,.../img/6.jpg,.../img/7.jpg];
const PagesImgAlt = ['1の写真','2の写真','3の写真','4の写真','5の写真','6の写真','7の写真',//'8の写真',
                    ];
let NowPage = 0;

window.addEventListener('DOMContentLoaded',UpdatePage); // 確認中にDOMContentLoadイベント発見
 
function UpdatePage(){
    const tutitle = document.querySelector('#TutorialTitle');
    if (tutitle) tutitle.textContent = Pagestext[NowPage].title;
    const tutext = document.querySelector('#TutorialText');
    if (tutext) tutext.textContent = Pagestext[NowPage].text;
    const tuimg = document.querySelector('#TutorialImgDiv');
    if (tuimg) {
        if (PagesImg[NowPage]) {
            tuimg.innerHTML = `
                <div class="TutorialContent" id="TutorialImg">
                    <img src="${PagesImg[NowPage]}" alt="${PagesImgAlt[NowPage]}"/>
                </div>`;
        } else {
            tuimg.innerHTML = '';
        }
    }
    const pno = document.querySelector('#prevNo');
    if (pno) pno.textContent = (NowPage - 1 + Pagestext.length) % Pagestext.length + 1;
    const nno = document.querySelector('#nextNo');
    if (nno) nno.textContent = (NowPage + 1) % Pagestext.length + 1;
}


function NextPage(){
    NowPage = (NowPage + 1) % Pagestext.length;
    UpdatePage();
}

function PrevPage(){
    NowPage = (NowPage - 1 + Pagestext.length) % Pagestext.length;
    UpdatePage();

}

