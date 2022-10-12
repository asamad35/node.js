class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchword = this.bigQ.search
      ? {
          $regex: this.bigQ.search,
          $options: "i",
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }

  //   aggreation (filter)
  filter() {
    // dont mutate original hence create copy
    const copyQ = { ...this.bigQ };

    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];

    // coverting to string to use regex
    let stringOfCopyQ = JSON.stringify(copyQ);
    stringOfCopyQ = stringOfCopyQ.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (m) => `$${m}`
    );

    // convertting to json
    const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
    console.log(jsonOfCopyQ, "jsonOfCopyQ");
    this.base = this.base.find(jsonOfCopyQ);

    return this;
  }

  pager(resultPerPage) {
    let currentPage = this.bigQ.page ?? 1;

    const skipVal = resultPerPage * (currentPage - 1);
    console.log(currentPage, skipVal, "skipVal");
    this.base = this.base.limit(resultPerPage).skip(skipVal);

    return this;
  }
}

module.exports = WhereClause;
