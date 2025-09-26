let ansFlug = 1;//計算結果が表示されているかどうか　１のとき結果が表示
//let lastOperatorIndex = -1;//最新の演算子の位置
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
    if(displayText == "0" ){//０だけの場合
        if(value == "00"){
            document.getElementById(id).value = "0";
        }else{
            document.getElementById(id).value = value;
        }
        
        
    }else if('+-×÷%'.includes(displayText.slice(-1))){//末尾が演算子の場合 入力した数字を追記
        if(value == '00'){//演算子の後、入力が００なら０に変更
            value = '0';
        }

        document.getElementById('inpMain').value += value;

    }else if(displayText.slice(-1) == '.'){//末尾に小数点がある場合
        document.getElementById(id).value += value;

    }else if(displayText.slice(-1) == ')'){//直前が負の数の場合
        //(-n)の中に数字を追記
        document.getElementById(id).value = displayText.slice(0,-1) + value + ')';



        // document.getElementById(id).value = displayText + "×"+ (value == '00' ? '0': value);
        // lastOperatorIndex = document.getElementById('inpMain').value.lastIndexOf('×');


    }else{//末尾が数字の場合(正の数)
        
        //console.log(displayText);
        let tokens = displayText.match(/\(-?[0-9]+(?:\.[0-9]+)?\)|[0-9]+(?:\.[0-9]+)?|[+\-×÷%()]/g);
        
        
        console.log('tokens',tokens);
        console.log('tokensの末尾の要素',tokens.slice(-1));
        let lastNum = tokens.pop() + value;
        //console.log(typeof(lastNum));

        if(!lastNum.includes('.')){//　小数点が含まれていない場合 　　　　　　　必要か確認
            
            console.log('lastNum',lastNum);

            lastNum = parseFloat(lastNum,10);
            //console.log('lastNum(float)',lastNum);


        }

        
        // if(tokens.slice(0,1) == '-'){
        //     tokens = '(' + tokens.slice(0,2).join('') + value + ')' + tokens.slice(2);
        //     console.log(tokens);
        // }
        
        // if(displayText.slice(0,lastOperatorIndex+1) == ''){//式が-ｎの場合　数字を入力すると nnになるのを回避するため
        //     document.getElementById(id).value = tokens.slice(0,-1).join('') + lastNum;
            
        // }else{
        //     document.getElementById(id).value = displayText.slice(0,lastOperatorIndex+1) + lastNum;
          
        // }
        document.getElementById(id).value = tokens.join('') + lastNum;
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
        //lastOperatorIndex = -1;
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
    //lastOperatorIndex = -1;
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

    if(ansFlug == 1){//計算結果が表示されている場合
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
    
    }else{//式を入力している場合
        
        //console.log(displayText);


        //末尾に演算子があった場合上書き
        if('+-×÷'.includes(displayText.slice(-1))){
            //-だけの場合は受け付けない
            if(displayText == '-' && displayText.length == 1){
                
            }else{
                displayText = displayText.slice(0,-1);
                document.getElementById('inpMain').value = displayText + value;
            }
            
            
            
        }else if(displayText.slice(-1) === '%'){//末尾の演算子が％の場合
            if(value === '%'){
                let tokens = displayText.match(/\(-?[0-9]+(?:\.[0-9]+)?\)|[0-9]+(?:\.[0-9]+)?|[+\-×÷%()]/g);
                console.log(tokens,'tokens');
                

                //最後の演算子のインデックスを探す
                let lastOperatorIndex = -1;
                for(let i=0; i<tokens.length; i++){
                    console.log(tokens.slice(i,i+1));
                    lastOperatorIndex = '+-×÷'.lastIndexOf(tokens.slice(i,i+1));
                    if(~lastOperatorIndex){
                        console.log('演算子が存在する',lastOperatorIndex);
                        lastOperatorIndex = i;
                        break;
                    }
                }

                console.log('lastOperatorIndex', lastOperatorIndex);
                //式中に％以外演算子がない場合
                if(lastOperatorIndex !== -1){
                    lastNum = tokens.slice(lastOperatorIndex + 1).join('');
                }
                else{
                    lastNum = tokens.join('');
                }

                console.log('lastNum',lastNum);
                
                







                console.log(lastNum,'lastNum');
                lastNum = '(' + lastNum + ')'+ value;
                console.log('lastNum',lastNum);
                console.log('tokens',tokens);
                console.log('tokens.slice(0,lastOperatorIndex-1).join(\'\')',tokens.slice(0,lastOperatorIndex-1).join(''));
                if(lastOperatorIndex == -1){
                     displayText =  lastNum;
                }else{
                    displayText = tokens.slice(0,lastOperatorIndex + 1).join('') + lastNum;
                }
                console.log(displayText,'displaytext');
                document.getElementById('inpMain').value =displayText;
                
            }else{//末尾: ％　入力:％以外 の場合
                displayText += value;
                document.getElementById('inpMain').value = displayText;
            }
        }
        
        
        
        else{//入力中の式の末尾が数字の場合
            document.getElementById('inpMain').value = displayText + value;
            //lastOperatorIndex = displayText.length;
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
    //const lastPointIndex = displayText.lastIndexOf('.');//後ろからみて一番最初にある'.'のあるインデックス
    ansFlug = 0;


    const tokens = displayText.match(/\(-[0-9]+(?:\.[0-9]*)?\)|[0-9]+(?:\.[0-9]*)?|[+\-×÷%()]/g);
    console.log('tokens',tokens);
    let lastToken = tokens.pop(); //<= (-n)
    console.log('aa',lastToken);

    //lastToken = lastToken.slice(0,-1);// )を取り除く <= (-n
    console.log('bb',lastToken);
    //const lastPointIndex = lastToken.lastIndexOf('.');






    //console.log('displaytext',displayText.slice(-1));
    if(!'+-×÷%'.includes(displayText.slice(-1))){//末尾が演算子でない場合
        //console.log('lastPointIndex',lastPointIndex);
        //console.log('lastOperatorIndex', lastOperatorIndex);

        if(lastToken.slice(-1) == ')'){
            console.log('末尾の）を削除');
            lastToken = lastToken.slice(0,-1);// 末尾の ) を削除
            console.log('lastToken',lastToken);
        }
            /////////////////////////////////////
            if(lastToken.includes('.')){//'.'が含まれている場合
                
                console.log('displaytext',displayText);

                if(lastToken.slice(-1) == '.'){//末尾に'.'がある場合
                    console.log('末尾に.がある');
                    //displayText = tokens.join('')+ lastToken.slice(0,-1);//　8. (-8. => 8 , (-8
                    console.log('displaytext',displayText);
                    lastToken = lastToken.slice(0,-1);
                }
                

            }else{//'.'が含まれていない
                
                displayText = tokens.join('') + lastToken + '.';
                lastToken += '.';
            }
        if(lastToken.slice(0,1) == "("){
            lastToken +=')';
        }

        document.getElementById('inpMain').value = tokens.join('') + lastToken;
        



    }
    // else if(displayText.slice(-1) == ')'){//末尾が')'の場合
    //     ///\(-?[0-9]+(?:\.[0-9]*)?\)|[0-9]+(?:\.[0-9]*)?|[+\-×÷%()]/g
    //     // /\(-?[0-9]+(?:\.[0-9]+)?\)|[0-9]+(?:\.[0-9]+)?|[+\-×÷%()]/g
           // /\(-[0-9]+(?:\.[0-9]*)?\)|[0-9]+(?:\.[0-9]*)?|[+\-×÷%()]/g 最新


    //     lastToken = lastToken.slice(0,-1);// )を取り除く <= (-n
        







    //     if(lastToken.slice(-1) == '.'){//<= (-n.の場合
    //         lastToken = lastToken.slice(0,-1); //.を取り除く
    //         console.log('a',lastToken);
            
    //     }else{
    //         lastToken += '.';
    //         console.log('b',lastToken);
    //     }
    //     console.log(tokens);
    //     document.getElementById('inpMain').value = tokens.join('') + lastToken + ')';
        

    // }
    else{//末尾が演算子の場合
        document.getElementById('inpMain').value = displayText + '0' + '.';
    }
    errorFlug = 0;
}

//　+/-ボタン押下処理
function press_PlusMinus_Btn(){
    console.log('press +/-');
    let displayText = document.getElementById('inpMain').value;
    console.log('displayText',displayText);
    let tokens = displayText.match(/\(-[0-9]+(?:\.[0-9]*)?\)|[0-9]+(?:\.[0-9]*)?|[+\-×÷%()]/g);
    
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
        
        //['-', '3', '+', '4', '+', '(-1)'] →　(-3)+4+(-1)
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
    //lastOperatorIndex = -1;
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
    const tokens = input.match(/\(-[0-9]+(?:\.[0-9]*)?\)|[0-9]+(?:\.[0-9]*)?|[+\-×÷%()]/g);
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
    
    // if(tokens.indexOf('%') != -1 && '0123456789'.includes(tokens.slice(tokens.indexOf('%') + 1))){
        
    // }
    












    for (let token of tokens) {
        console.log('RPNのfor文の変数の中身', token);
        
        if(token.slice(0,1) == '(' && token.slice(-1) == ')'){//トークンが負の数の場合 (-n)の形
            token = token.slice(1,-1);
        }
        

        // 数字なら出力キューに追加
        if (!isNaN(token)){
            console.log('token 数字なら出力キューに追加',token);

            output.push(token.slice(-1) == '.' ? token.slice(0,-1) : token);//末尾が . なら削除

        // 演算子の場合
        }
        //else if(){
            
        //}
        
        
        
        
        else if (token in operators) {
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
            console.log('数字を数字用バッファに追加',token,typeof(token));
            token = parseFloat(token, 10); // 8.00 => 8にするため
            numBuffer.push(token);
        }else{
            console.log('数字でない場合');
            numB = numBuffer.pop();
            numA = numBuffer.pop();
            // numB = parseFloat(numBuffer.pop(),10);
            // numA = parseFloat(numBuffer.pop(),10);
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




// SVN
