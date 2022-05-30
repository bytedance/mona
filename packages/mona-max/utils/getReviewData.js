module.exports = function getReviewData(data) {
  if(!data) return ''
  const result = []
  try {
      Object.values(data).forEach((v) => {
        const formValue = JSON.parse(v)
        // compatible
        if(formValue.type === 13) {
          delete formValue.value.link_text
        }
        result.push({
          c_type: formValue.type,
          name: formValue.name,
          reject_info: null,
          scheme_value: JSON.stringify(formValue.value)
        })
      })
  }catch(e) {
    console.log('save review value failed', e)
  }
  console.log('save review value success')
  return JSON.stringify(result)
}

