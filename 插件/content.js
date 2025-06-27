// 商品名称填写模块
function fillProductName() {
  const textarea = document.querySelector('#productName textarea');
  if (textarea) {
    // 获取React内部实例
    const reactKey = Object.keys(textarea).find(key => key.startsWith('__reactFiber'));
    const reactInstance = textarea[reactKey];
    // 通过React内部方法设置值
    if (reactInstance) {
      const props = reactInstance.memoizedProps;
      if (props.onChange) {
        const event = { target: { value: '1111111111111' } };
        props.onChange(event);
        console.log('通过React事件成功设置值');
      }
    }
  }
}
// 2. 选择商品产地（中国大陆 广东省）
  function fillForm() {
  // 1. 先填写商品原产地
  const selectTrigger = document.querySelector('#productOriginCode [data-testid="beast-core-select-header"]');
  if (selectTrigger) {
    selectTrigger.click();
    
    setTimeout(() => {
      const options = document.querySelectorAll('li[role="option"] span');
      const chinaOption = Array.from(options).find(el => el.textContent.includes('中国大陆'));
      
      if (chinaOption && chinaOption.closest('li')) {
        chinaOption.closest('li').click();
        
        const input = document.querySelector('#productOriginCode input[data-testid="beast-core-select-htmlInput"]');
        if (input) {
          input.value = "中国大陆";
          ['input', 'change', 'blur'].forEach(eventType => {
            input.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
        }
        
        // 2. 等待原产地选择完成后再选择省份
        setTimeout(() => {
          const provinceInput = document.querySelector('[data-testid="beast-core-grid-row"] [data-testid="beast-core-select"] input[placeholder="请选择省份"]');
          if (provinceInput) {
            provinceInput.click();
            
            setTimeout(() => {
              const options = document.querySelectorAll('li[role="option"] span');
              const guangdongOption = Array.from(options).find(el => el.textContent.includes('广东省'));
              
              if (guangdongOption && guangdongOption.closest('li')) {
                guangdongOption.closest('li').click();
                ['input', 'change', 'blur'].forEach(eventType => {
                  provinceInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                });
              }
            }, 500);
          }
        }, 2000);
      }
    }, 500);
  }
}
function selectEuropeanSizes() {
  // 1. 先选择欧美尺码
  const euHeader = document.querySelector('.minor-spec-checkbox-group_header__HawwC [data-testid="beast-core-select-header"]');
  if (euHeader) {
    euHeader.click();
    
    setTimeout(() => {
      const options = document.querySelectorAll('[role="option"]');
      options.forEach(option => {
        if (option.textContent.trim() === '欧美尺码') {
          option.click();
        }
      });
      
      // 2. 延迟后选择S/M/L/XL尺寸
      setTimeout(() => {
        const sizes = ['S', 'M', 'L', 'XL'];
        const checkboxes = document.querySelectorAll('.spec-checkbox-group_sizeContainer__M3d2g .CBX_textWrapper_5-117-0');
        
        checkboxes.forEach(checkbox => {
          if (sizes.includes(checkbox.textContent.trim())) {
              setTimeout(() => { 
                  // 点击复选框
            const label = checkbox.closest('label[data-testid="beast-core-checkbox"]');
            if (label) {
              label.click();
              console.log(1);
              
              // 触发React事件
              const input = label.querySelector('input[type="checkbox"]');
              if (input && input.__reactProps?.onChange) {
                input.__reactProps.onChange({
                  target: {
                    checked: true,
                    value: checkbox.textContent.trim()
                  }
                });
              }
            }
              }, 2000);
          }
        });
      }, 500);
    }, 500);
  }
}
//3商品属性填写
function extractChinese(str) {
  return str.replace(/[A-Za-z].*/, '');
}
function selectOption(selector, textOptions, value, name) {
  const selectElement = document.querySelector(selector);
  if (selectElement) {
    selectElement.click();
    
    setTimeout(() => {
      const options = document.querySelectorAll('.PT_outerWrapper_5-117-0 [role="option"]');
      options.forEach(option => {
        // 匹配多个文本选项
        const shouldSelect = textOptions.some(text => {
            // console.log(extractChinese(option.textContent)==text);
            return extractChinese(option.textContent)==text
        }
    )
        if (shouldSelect) {
          option.click();
          
          // 触发React事件
          const reactProps = selectElement.__reactProps;
          if (reactProps && reactProps.onChange) {
            reactProps.onChange({ 
              target: { 
                value: value,
                name: name
              } 
            });
          }
        }
      });
    }, 500);
  }
}
function fillAllOptions(formData) {
  formData.forEach(item => {
    if (item.value && item.value !== "请选择" && item.value !== "") {
      // 添加延迟以避免同时触发多个下拉框
      setTimeout(() => {
        selectOption(item.selector, item.textOptions, item.value, item.name);
      }, Math.random() * 1000 + 500);
    }
  });
  console.log('所有选项已开始填充');
}
//
//4获取商品信息
const main=(formData)=>{
    fillProductName()
    fillForm()
    fillAllOptions(formData)
    selectEuropeanSizes()
}



// 通过消息通信触发
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    const dataType = request.size;
    fetch(chrome.runtime.getURL('data.json'))
      .then(response => response.json())
      .then(data => {
        fillProductName()
        main(data[dataType])
      });
  }
});