// https://github.com/cure53/DOMPurify
const htmlSanitizeConfig = {
  ALLOW_UNKNOWN_PROTOCOLS: true // To allow blob render from browser's RAM
};

export default htmlSanitizeConfig;
