import _ from "lodash";

export const filterData = ({ fields = [""], object = {} }) => {
  return _.pick(object, fields);
};
