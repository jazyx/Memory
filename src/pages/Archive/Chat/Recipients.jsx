/**
 * Project/frontend/src/pages/Chat/Rceipents.jsx
 */


export const Recipients = ({
  groupMembers,
  to,
  setTo
}) => {

  // Don't allow the multiple select element to get too high
  const size = Math.min(4, groupMembers.length)

  
  const chooseRecipients = ({ target }) => {
    // Extract values of selected options
    const values = Array
      .from(target.selectedOptions, option => option.value
    )

    setTo(values)
  }


  const options = groupMembers.map(({ name, online }) =>  (
    <option
      key={name}
      value={name }
    >
      {`${name}${online ? " 🟢" : ""}`}
    </option>
  ))


  const selector = options.length
    ? <select
         value={to}
         onChange={chooseRecipients}
         multiple={true}
         size={size}
       >
         {options}
       </select>
    : "No recipients available"


  return (
    <label>
      <span>To</span>
      {selector}
    </label>
  )
}