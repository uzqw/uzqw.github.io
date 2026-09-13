define(['Reg'], function (Reg) {
   /**
    * 按键记录
    */
   class KeyCount {
      constructor() {
         this.all        = 0;
         this.az         = 0;
         this.number     = 0;
         this.ctrl       = 0;
         this.shift      = 0;
         this.meta       = 0;
         this.alt        = 0;
         this.function   = 0;
         this.space      = 0;
         this.backspace  = 0;
         this.semicolon  = 0;
         this.quot       = 0;
      }

      reset (){
         for (let name in this) {
            this[name] = 0;
         }
      }

      // Count Key
      countKeys(e) {
         // 只认物理键位 e.code：IME 组字期间 e.key 会变成 'Process'/'Unidentified'
         // （Windows 组字期 keyup/keydown 都是 'Process'，Linux keyup 也不可靠），
         // 而 e.code 始终是真实键位。无 e.code 的事件直接丢弃，
         // 这也是上游 KyleBing/typepad v2.46 的修复：原来 KEYS.all = /.*/ 会把 'Process' 计入 all，
         // 导致击键/码长虚高。
         if (!e.code) return;
         for (let type in this){
            if ( typeof(this[type]) !== 'function' ){
               if (Reg.CODES[type].test(e.code)){
                  this[type]++
               }
            }
         }
      }

      // 上屏键（空格/数字选词）在 Wayland 下被输入法吞掉，页面收不到
      // ponytail: 近似——一次上屏必然有一次选词键，若方案开了自动上屏（无选词键）会多算 1
      plusCommitKey() {
         this.all++;
         this.space++;
      }

      // Wayland 等组字期拿不到任何按键事件的平台，按组字串增量补击键（拼音/五笔字母）
      plusKeys(count) {
         this.all += count;
         this.az  += count;
      }
   }

   return KeyCount
})