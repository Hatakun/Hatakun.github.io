let ansFlug = 1;//計算結果が表示されているかどうか　１のとき結果が表示
let lastOperatorIndex = -1;//最新の演算子の位置
let errorFlug = 0;//1の時エラー
// スタイルシート変更処理
function chgStyle() 
{
    let pageObj = document.getElementById('pageStyle');
    
    if (document.getElementById('btnPage').textContent == 'i')
    {
        pageObj.href = 'css/calc_chrome_google.css';
        document.getElementById('btnPage').textContent = 'g';
    }
    else
    {
        pageObj.href = 'css/calc_chrome_ios.css';
        document.getElementById('btnPage').textContent = 'i';
    }
}

// 入力項目追記処理
function inpAppend(id, value) 
{   console.log('inpAppend');

    const displayText = document.getElementById(id).value;

    console.log(displayText);
    if(document.getElementById(id).value == "0" ){//０だけの場合
        if(value == "00"){
            document.getElementById(id).value = "0";
        }else{
            document.getElementById(id).value = value;
        }
        
        
    }else if('+-×÷%'.includes(displayText.slice(-1))){//末尾が演算子の場合
        if(value == '00'){//演算子の後、入力が００なら０に変更
            value = '0';
        }

        document.getElementById('inpMain').value += value;

    }else if(displayText.slice(-1) == '.'){
        document.getElementById(id).value += value;

    }else if(displayText.slice(-1) == ')'){
        
        document.getElementById(id).value = displayText + "×"+ (value == '00' ? '0': value);
        lastOperatorIndex = document.getElementById('inpMain').value.lastIndexOf('×');
    }else{//末尾が数字の場合
        
        //console.log(displayText);
        const tokens = displayText.match(/\(-?[0-9]+(?:\.[0-9]+)?\)|[0-9]+(?:\.[0-9]+)?|[+\-×÷%()]/g);
        
        ///-?\d+(\.\d*)?|[+\-×÷]/g
        console.log('tokens',tokens);
        console.log('tokensの末尾の要素',tokens.slice(-1));
        let lastNum = tokens.slice(-1) + value;
        //console.log(typeof(lastNum));

        if(!lastNum.includes('.')){
            //console.log('aaa');
            //console.log('lastNum',lastNum);

            lastNum = parseFloat(lastNum,10);
            //console.log('lastNum(float)',lastNum);


        }

        console.log(';;');
        if(displayText.slice(0,lastOperatorIndex+1) == ''){
            document.getElementById(id).value = tokens.slice(0,-1).join('') + lastNum;
        }else{
            document.getElementById(id).value = displayText.slice(0,lastOperatorIndex+1) + lastNum;
          
        }
    }
    
}

// 入力項目置き換え処理
function inpUpdate(id, value) 
{   console.log('inpUpdate');
    if(value == "00" || value == '0'){
    value = '0';
    }else if(value == '-'){
        //pass

    }else{
        lastOperatorIndex = -1;
        ansFlug = 0;
    }
    document.getElementById(id).value = value;
}

// クリアボタン押下処理
function pressClear() 
{   
    
    if(ansFlug == 1 && document.getElementById('inpMain').value === '0'){
    document.getElementById('inpFormula').value = '';
    }
    
    // 入力エリアを0に初期化する
    inpUpdate('inpMain', '0');
    //内部情報も初期化
    ansFlug = 1;
    lastOperatorIndex = -1;
}

// 数値ボタン押下処理
function pressBtn(value) 
{   if(ansFlug == 1){
        inpUpdate('inpMain', value);
        
        console.log('pressBtn','if');
    
    }else{
        console.log('pressBtn','else');
        inpAppend('inpMain', value);
    }
    
}
// 演算子+(%)ボタン押下処理
function pressOperatorBtn(value){
    let displayText = document.getElementById('inpMain').value;
    if(ansFlug == 1){
        console.log('in Operator Button operasion of ansFlug == 1');
        if(value == '-' && displayText == '0'){
            console.log('in Operator Button value == -');
            //最初の入力が'-'の時だけ受け付ける
            inpUpdate('inpMain', value);
            
        }else{
            console.log('value != -');
            document.getElementById('inpMain').value += value;
            
            //マイナス以外は最初の入力を受け付けない
        }
        ansFlug = 0;
    
    }else{
        
        console.log(displayText);


        //末尾に演算子があった場合上書き
        if('+-×÷%'.includes(displayText.slice(-1))){
            //-だけの場合は受け付けない
            if(displayText == '-' && displayText.length == 1){

            }else{
                displayText = displayText.slice(0,-1);
                document.getElementById('inpMain').value = displayText + value;
            }
            
            
            
        }else{
            document.getElementById('inpMain').value = displayText + value;
            lastOperatorIndex = displayText.length;
            //console.log(lastOperatorIndex);
        }
        
    }
}
//小数点ボタン押下処理
function pressDecimal_pointBtn(){

    let displayText = document.getElementById('inpMain').value;
    if(ansFlug == 1){//結果が表示されている場合は上書きで０.
        displayText = "0";
    }
    const lastPointIndex = displayText.lastIndexOf('.');//後ろからみて一番最初にある'.'のあるインデックス
    ansFlug = 0;
    //console.log('displaytext',displayText.slice(-1));
    if(!'+-×÷%)'.includes(displayText.slice(-1))){//末尾が演算子且つ')'でない場合
        console.log('lastPointIndex',lastPointIndex);
        console.log('lastOperatorIndex', lastOperatorIndex);
        if(lastPointIndex !== -1){//'.'が含まれている場合
            
            console.log(displayText.length-1);
            if(lastPointIndex == displayText.length - 1){//末尾に'.'がある場合
                
                document.getElementById('inpMain').value = displayText.slice(0,-1);
                
            }else if(lastOperatorIndex > lastPointIndex){//最後の小数点より後に演算子がある場合
                document.getElementById('inpMain').value = displayText + '.';
                
            }
            

        }else{//'.'が含まれていない

            document.getElementById('inpMain').value = displayText + '.';

        }
    }else if(displayText.slice(-1) == ')'){//末尾が')'の場合

        
        
        document.getElementById('inpMain').value = displayText + '×' + "0." 
        lastOperatorIndex = document.getElementById('inpMain').value.lastIndexOf('×');

    }else{//末尾が演算子の場合
        document.getElementById('inpMain').value = displayText + '0' + '.'
    }
    errorFlug = 0;
}

//　+/-ボタン押下処理
function press_PlusMinus_Btn(){
    console.log('press +/-');
    let displayText = document.getElementById('inpMain').value;
    console.log('displayText',displayText);
    let tokens = displayText.match(/\(-?[0-9]+(?:\.[0-9]+)?\)|[0-9]+(?:\.[0-9]+)?|[+\-×÷%()]/g);
    
    console.log('tokens',tokens);
    const lastToken = tokens.pop();
    console.log('tokens',tokens);

    if(ansFlug == 1 && displayText != '0'){//計算結果が０でない場合に押下されると、ansFlugを下げる
        ansFlug = 0;
    }


    if(tokens[0] == '-' && tokens.length === 1){
        tokens.length = 0;
        document.getElementById('inpMain').value = lastToken;
        return;
    }
    if(displayText == '0'){
        return;
    }

    if(!isNaN(lastToken)){// 4.3, 3, 3., 3.0
        
        //末尾が数字の時
        console.log('+/- 末尾が数字')

        if(tokens.slice(-1) == '-'){
            //最後の演算子が-の場合 +に置換
            //console.log('+/- 末尾が-');
            tokens.pop();
            tokens.push('+');
            document.getElementById('inpMain').value = tokens.join('') + lastToken;
        }else if(tokens.slice(-1) == '+'){
            //最後の演算子が+の場合 -に置換
            tokens.pop();
            tokens.push('-');
            document.getElementById('inpMain').value = tokens.join('') + lastToken;
        }else if(lastToken == 0){
            return;
        }else{
            document.getElementById('inpMain').value = tokens.join('') + '(-' + lastToken + ')';
        }

        


    }else if('+-×÷%'.includes(lastToken)){//末尾が演算子の場合

        
        //末尾が演算子の場合受け付けない

    }else{
        console.log('else');
        console.log(lastToken);
        console.log(lastToken.slice(0,1));
        if(lastToken.slice(0,2)== '(-' && lastToken.slice(-1) == ')'){
            console.log('カッコつき');
            document.getElementById('inpMain').value = tokens.join('') + lastToken.slice(2,-1);
        }
    }

}




// イコールボタン押下処理
function pressEqual(){
    console.log('pressEqual()');
    //console.log('errorFlug: into pressEqual',errorFlug);

    let formulaText = document.getElementById('inpMain').value;

    //前の計算結果がエラーでないとき
    if(errorFlug != 1){
        document.getElementById('inpFormula').value = formulaText; 
    }//計算式エリアには末尾の演算子が削除される前の状態で表示

    //末尾が演算子の場合
    if('+-×÷%'.includes(formulaText.slice(-1))){
        formulaText = formulaText.slice(0,-1);//末尾削除
    }
    
    //先頭が'-ｎ'の場合　(-ｎ)に置換　Ｚ∍ｎ
    if(formulaText.slice(0,1)=== '-'){
        // -3+4+(-1) → ['-', '3', '+', '4', '+', '(-1)']
        const tokens = formulaText.match(/\(-?[0-9]+(?:\.[0-9]+)?\)|[0-9]+(?:\.[0-9]+)?|[+\-×÷%()]/g);
        
        formulaText = '(' + tokens.slice(0,2).join('') + ')' + tokens.slice(2).join('');
        console.log('EqualBtn, formulaText', formulaText)

    }


    


    const rpn = RPN(formulaText);
    let ans = calcurate(rpn);

    console.log('rpn',rpn);
    console.log('ans',ans);
    //console.log('after calculating ans of errorFlug',errorFlug);
    if(!ans && ans != 0){//NaNの時だけtrueにしたいため、０の否定も必要
        errorFlug = 1;
        ans = '計算できませんでした';
    }
    document.getElementById("inpMain").value = ans;
    
    ansFlug = 1;
    lastOperatorIndex = -1;
    console.log('errorFlug2',errorFlug);
    
    
}













//逆ポーランド記法に変換
function RPN(input){
    console.log('RPN変換のinput',input);
    const output = [];
    const operatorStack = [];
    const buffer = [];
    const operators = {
    '+': { precedence: 1 },
    '-': { precedence: 1 },
    '×': { precedence: 2 },
    '÷': { precedence: 2 },
    '%': { precedence: 2 },
    };
    console.log('input',input);
    const tokens = input.match(/\(-?[0-9]+(?:\.[0-9]+)?\)|[0-9]+(?:\.[0-9]+)?|[+\-×÷%()]/g);
    if(tokens == null){
        errorFlug = 1;
        console.log('式がnull');
        return '0';//calculate()の引数になるためinput = nullを避ける なんでもよいが先頭が０である必要がある
    }

    //////////////////////
    console.log(tokens);
    const num = parseFloat(tokens[-1]);
    console.log(num);
    /////////////////////
    
    if(tokens.indexOf('%') != -1 && '0123456789'.includes(tokens.slice(tokens.indexOf('%') + 1))){

    }
    for (let token of tokens) {
        console.log('RPNのfor文の変数の中身', token);

        if(token.slice(0,1) == '(' && token.slice(-1) == ')'){
            token = token.slice(1,-1);
        }

        // 数字なら出力キューに追加
        if (!isNaN(token)){
            console.log('token',token);
            output.push(token);

        // 演算子の場合
        }else if (token in operators) {
            while (
            operatorStack.length > 0 &&
            operators[operatorStack[operatorStack.length - 1]] &&
            operators[operatorStack[operatorStack.length - 1]].precedence >= operators[token].precedence
            ){
            output.push(operatorStack.pop());
            }
            operatorStack.push(token);
        // それ以外
        }else{
            console.log('RPN 無効なトークン');
            errorFlug = 1;
            return '無効なトークン: ' + token;
        }
    }

  // 残りの演算子を出力キューに追加
    while (operatorStack.length > 0) {
        output.push(operatorStack.pop());
    }

    return output;
}


//逆ポーランド記法の式を計算
function calcurate(input){
    //console.log('calcurate in errorFlug', errorFlug);
    console.log('calcurate input',input == null ? "null": input);
    const numBuffer = [];
    for(token of input){
        if(!isNaN(token)){
            numBuffer.push(token);
        }else{
            numB = parseFloat(numBuffer.pop(),10);
            numA = parseFloat(numBuffer.pop(),10);
            //小数第１０位までで丸め処理
            switch(token){
                case '+':
                    numBuffer.push(round(numA + numB,10));
                    break;
                case '-':
                    numBuffer.push(round(numA - numB,10));
                    break;
                case '×':
                    numBuffer.push(round(numA * numB,10));
                    break;
                case '÷':
                    if(numB == 0){
                        errorFlug = 1;
                        return '0では割れません';

                    }
                    numBuffer.push(round(numA / numB,10));
                    break;

                case '%':
                    console.log('ans %', round(((numA % numB)+ numB) % numB,10));
                    numBuffer.push(round(((numA % numB)+ numB) % numB,10));
                    break;

            }
        }
    }
    console.log('計算結果',numBuffer);
    errorFlug = 0;
    if(numBuffer.length === 1){
        return numBuffer[0];
    }else{
        console.log('calculate() 式エラー');
        errorFlug = 1;
        return '式エラー';
    }
    
    
    
}
//計算時の丸め処理
function round(num, digits) {
  const factor = Math.pow(10, digits);
  return Math.round(num * factor) / factor;
}