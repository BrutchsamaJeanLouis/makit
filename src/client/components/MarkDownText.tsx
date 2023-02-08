import React from 'react'
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux'
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const MarkDownText = (props) => {
  const markdown = `<form action="https://www.paypal.com/donate" method="post" target="_top">
  <!-- Identify your business so that you can collect the payments. -->
  <input type="hidden" name="business" value="donations@kcparkfriends.org">
  <!-- Specify details about the contribution -->
  <input type="hidden" name="no_recurring" value="0">
  <input type="hidden" name="item_name" value="Friends of the Park">
  <input type="hidden" name="item_number" value="Fall Cleanup Campaign">
  <input type="hidden" name="currency_code" value="USD">
  <!-- Display the payment button. -->
  <input type="image" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" alt="Donate">
  <img alt="" width="1" height="1" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >
 </form>`;
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {markdown}
    </ReactMarkdown>
  );
};

export default connect()(MarkDownText);
