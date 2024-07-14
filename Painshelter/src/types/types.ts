import { Timestamp } from "firebase/firestore";

export interface Story {
  storyId: string;
  title: string;
  time: string;
  location: { name: string };
  type: string[];
  figure: string[];
  story: string;
  likedAuthorId?: string[];
  userComments?: UserComment[];
}

export interface Author {
  id: string;
  name: string;
  img: string;
}

export interface AuthorData {
  Registration: Timestamp;
  email: string;
  id: string;
  name: string;
}

export interface HandleEditSubmitParams {
  event: React.FormEvent<HTMLFormElement>;
  value: string;
  storyTitle: { value: string };
  storyTime: { value: string };
  storyImage: { value: string };
  storyType: { getSortedCheckedValues: () => string[] };
  storyFigure: { getSortedCheckedValues: () => string[] };
  postStory: { value: string };
  setIsEdit: (isEdit: boolean) => void;
}

export interface EditFormInput {
  value: string;
  setValue: (value: string) => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface CheckboxInput {
  checkedValues: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getSortedCheckedValues: () => string[];
}

export interface UserComment {
  id: string;
  comment: string;
}
