export default class Association {
  constructor(
    public readonly id: number,
    public idUsers: number[],
    public name: string,
  ) {}
}
