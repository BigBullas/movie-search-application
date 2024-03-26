/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Dir {
  /**
   * Числовой идентификатор папки
   * @format int32
   * @example 1337
   */
  dirId?: number;
  /**
   * Название папки
   * @example "TestName"
   */
  name?: string;
  /**
   * Числовой идентификатор создателя папки
   * @format int32
   * @example 1337
   */
  userId?: number;
  subdirs?: Dir[];
}

export interface Note {
  /**
   * ID заметки
   * @format int32
   * @example 1337
   */
  noteId?: number;
  /**
   * Заголовок заметки
   * @example "Test header"
   */
  name?: string;
  /**
   * Тело заметки в формате, который понимает редактор
   * @example "Test body"
   */
  body?: string;
  /**
   * Дата создания заметки.
   * @format date-time
   * @example "2017-01-01T00:00:00.000Z"
   */
  createdAt?: string;
  /**
   * Дата последенго изменения заметки.
   * @format date-time
   * @example "2017-01-01T00:00:00.000Z"
   */
  lastUpdate?: string;
  /**
   * ID папки, которой принадлежит заметка
   * @format int32
   * @example 1337
   */
  parentDir?: number;
  /**
   * ID пользователя, которому принадлежит заметка
   * @format int32
   * @example 1337
   */
  userId?: number;
}

export interface NotePreview {
  /**
   * ID заметки
   * @format int32
   * @example 1337
   */
  noteId: number;
  /**
   * Заголовок заметки
   * @example "Test header"
   */
  name: string;
  /**
   * ID папки, которой принадлежит заметка
   * @format int32
   * @example 1337
   */
  parentDir: number;
}

export interface NoteCreationResponse {
  /**
   * ID заметки
   * @format int32
   * @example 1337
   */
  noteId: number;
}

export interface DirCreationResponse {
  /**
   * ID папки
   * @format int32
   * @example 1337
   */
  dirId?: number;
}

export interface Error {
  /**
   * Текстовое описание ошибки
   * @example "note with this id not found"
   */
  msg: string;
}

export interface NotesOverview {
  notes?: NotePreview[];
}

export interface DirsOverview {
  dirs?: Dir[];
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || 'https://smartlectures.ru/api/v1',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === 'object'
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== 'string'
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { 'Content-Type': type }
          : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title EasyTex API
 * @version 0.1.9
 * @baseUrl https://smartlectures.ru/api/v1
 *
 * Документация по API EasyTex
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  notes = {
    /**
     * @description Создание заметки
     *
     * @tags notes
     * @name NotesCreate
     * @summary Создание заметки
     * @request POST:/notes
     */
    notesCreate: (data: Note, params: RequestParams = {}) =>
      this.request<NoteCreationResponse, Error>({
        path: `/notes`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Получение информации о заметка для отображения превью
     *
     * @tags notes
     * @name OverviewList
     * @summary Получение заметок для отображения структуры
     * @request GET:/notes/overview
     */
    overviewList: (params: RequestParams = {}) =>
      this.request<NotesOverview, Error>({
        path: `/notes/overview`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Получение заметки.
     *
     * @tags notes
     * @name NotesDetail
     * @summary Получение заметки по ID
     * @request GET:/notes/{noteId}
     */
    notesDetail: (noteId: number, params: RequestParams = {}) =>
      this.request<Note, Error>({
        path: `/notes/${noteId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Обновление заметки.
     *
     * @tags notes
     * @name NotesUpdate
     * @summary Обновление заметки по ID
     * @request PUT:/notes/{noteId}
     */
    notesUpdate: (noteId: number, data: Note, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/notes/${noteId}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаление заметки.
     *
     * @tags notes
     * @name NotesDelete
     * @summary Удаление заметки по ID
     * @request DELETE:/notes/{noteId}
     */
    notesDelete: (noteId: number, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/notes/${noteId}`,
        method: 'DELETE',
        ...params,
      }),
  };
  dirs = {
    /**
     * No description
     *
     * @tags dirs
     * @name DirsCreate
     * @summary Создание папки
     * @request POST:/dirs
     */
    dirsCreate: (data: Dir, params: RequestParams = {}) =>
      this.request<DirCreationResponse, any>({
        path: `/dirs`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags dirs
     * @name DirsUpdate
     * @summary Обновление папки по ID
     * @request PUT:/dirs/{dirId}
     */
    dirsUpdate: (dirId: number, data: Dir, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/dirs/${dirId}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dirs
     * @name DirsDelete
     * @summary Удаление папки по ID
     * @request DELETE:/dirs/{dirId}
     */
    dirsDelete: (dirId: number, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/dirs/${dirId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * @description Получение структры папок пользователя для отображения структуры файлов/папок
     *
     * @tags dirs
     * @name OverviewList
     * @summary Получение структры папок пользователя
     * @request GET:/dirs/overview
     */
    overviewList: (params: RequestParams = {}) =>
      this.request<DirsOverview, Error>({
        path: `/dirs/overview`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  images = {
    /**
     * No description
     *
     * @tags images
     * @name UploadCreate
     * @request POST:/images/upload
     */
    uploadCreate: (
      data: {
        /** @format binary */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          src?: string;
        },
        Error
      >({
        path: `/images/upload`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  };
}
