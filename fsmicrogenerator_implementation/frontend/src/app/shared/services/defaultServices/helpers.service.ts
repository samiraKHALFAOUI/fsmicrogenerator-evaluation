import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { CommonModule, DecimalPipe } from '@angular/common';
import { inject } from '@angular/core';
import { API } from './api.service';
import { SecureStorageService } from './secureStorage.service';
type SetValueByPathOptions =
  | {
    value?: { path: string; obj?: any };
    pipes?: ((value: any) => any)[];
    when?: boolean;
  }
  | { value?: any; pipes?: ((value: any) => any)[]; when?: boolean };
@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  private decimalPipe = inject(DecimalPipe);
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private translateService: TranslateService,
    private domSanitizer: DomSanitizer,
    private secureStorage: SecureStorageService
  ) { }
  listIcons: any = [
    { title: 'pi pi-align-justify' },
    { title: 'pi pi-align-center' },
    { title: 'pi pi-align-left' },
    { title: 'pi pi-align-right' },
    { title: 'pi pi-amazon' },
    { title: 'pi pi-android' },
    { title: 'pi pi-angle-double-down' },
    { title: 'pi pi-angle-double-left' },
    { title: 'pi pi-angle-double-right' },
    { title: 'pi pi-angle-double-up' },
    { title: 'pi pi-angle-down' },
    { title: 'pi pi-angle-left' },
    { title: 'pi pi-angle-right' },
    { title: 'pi pi-angle-up' },
    { title: 'pi pi-apple' },
    { title: 'pi pi-arrow-circle-down' },
    { title: 'pi pi-arrow-circle-left' },
    { title: 'pi pi-arrow-circle-right' },
    { title: 'pi pi-arrow-circle-up' },
    { title: 'pi pi-arrow-down' },
    { title: 'pi pi-arrow-down-left' },
    { title: 'pi pi-arrow-down-right' },
    { title: 'pi pi-arrow-left' },
    { title: 'pi pi-arrow-right' },
    { title: 'pi pi-arrow-up' },
    { title: 'pi pi-arrow-up-left' },
    { title: 'pi pi-arrow-up-right' },
    { title: 'pi pi-arrows-h' },
    { title: 'pi pi-arrows-v' },
    { title: 'pi pi-at' },
    { title: 'pi pi-backward' },
    { title: 'pi pi-ban' },
    { title: 'pi pi-bars' },
    { title: 'pi pi-bell' },
    { title: 'pi pi-bolt' },
    { title: 'pi pi-book' },
    { title: 'pi pi-bookmark' },
    { title: 'pi pi-bookmark-fill' },
    { title: 'pi pi-box' },
    { title: 'pi pi-briefcase' },
    { title: 'pi pi-building' },
    { title: 'pi pi-calendar' },
    { title: 'pi pi-calendar-minus' },
    { title: 'pi pi-calendar-plus' },
    { title: 'pi pi-calendar-times' },
    { title: 'pi pi-camera' },
    { title: 'pi pi-car' },
    { title: 'pi pi-caret-down' },
    { title: 'pi pi-caret-left' },
    { title: 'pi pi-caret-right' },
    { title: 'pi pi-caret-up' },
    { title: 'pi pi-chart-bar' },
    { title: 'pi pi-chart-line' },
    { title: 'pi pi-chart-pie' },
    { title: 'pi pi-check' },
    { title: 'pi pi-check-circle' },
    { title: 'pi pi-check-square' },
    { title: 'pi pi-chevron-circle-down' },
    { title: 'pi pi-chevron-circle-left' },
    { title: 'pi pi-chevron-circle-right' },
    { title: 'pi pi-chevron-circle-up' },
    { title: 'pi pi-chevron-down' },
    { title: 'pi pi-chevron-left' },
    { title: 'pi pi-chevron-right' },
    { title: 'pi pi-chevron-up' },
    { title: 'pi pi-circle' },
    { title: 'pi pi-circle-fill' },
    { title: 'pi pi-clock' },
    { title: 'pi pi-clone' },
    { title: 'pi pi-cloud' },
    { title: 'pi pi-cloud-download' },
    { title: 'pi pi-cloud-upload' },
    { title: 'pi pi-code' },
    { title: 'pi pi-cog' },
    { title: 'pi pi-comment' },
    { title: 'pi pi-comments' },
    { title: 'pi pi-compass' },
    { title: 'pi pi-copy' },
    { title: 'pi pi-credit-card' },
    { title: 'pi pi-database' },
    { title: 'pi pi-desktop' },
    { title: 'pi pi-directions' },
    { title: 'pi pi-directions-alt' },
    { title: 'pi pi-discord' },
    { title: 'pi pi-dollar' },
    { title: 'pi pi-download' },
    { title: 'pi pi-eject' },
    { title: 'pi pi-ellipsis-h' },
    { title: 'pi pi-ellipsis-v' },
    { title: 'pi pi-envelope' },
    { title: 'pi pi-euro' },
    { title: 'pi pi-exclamation-circle' },
    { title: 'pi pi-exclamation-triangle' },
    { title: 'pi pi-external-link' },
    { title: 'pi pi-eye' },
    { title: 'pi pi-eye-slash' },
    { title: 'pi pi-facebook' },
    { title: 'pi pi-fast-backward' },
    { title: 'pi pi-fast-forward' },
    { title: 'pi pi-file' },
    { title: 'pi pi-file-excel' },
    { title: 'pi pi-file-pdf' },
    { title: 'pi pi-filter' },
    { title: 'pi pi-filter-fill' },
    { title: 'pi pi-filter-slash' },
    { title: 'pi pi-flag' },
    { title: 'pi pi-flag-fill' },
    { title: 'pi pi-folder' },
    { title: 'pi pi-folder-open' },
    { title: 'pi pi-forward' },
    { title: 'pi pi-github' },
    { title: 'pi pi-globe' },
    { title: 'pi pi-google' },
    { title: 'pi pi-hashtag' },
    { title: 'pi pi-heart' },
    { title: 'pi pi-heart-fill' },
    { title: 'pi pi-history' },
    { title: 'pi pi-home' },
    { title: 'pi pi-id-card' },
    { title: 'pi pi-image' },
    { title: 'pi pi-images' },
    { title: 'pi pi-inbox' },
    { title: 'pi pi-info' },
    { title: 'pi pi-info-circle' },
    { title: 'pi pi-instagram' },
    { title: 'pi pi-key' },
    { title: 'pi pi-link' },
    { title: 'pi pi-linkedin' },
    { title: 'pi pi-list' },
    { title: 'pi pi-lock' },
    { title: 'pi pi-lock-open' },
    { title: 'pi pi-map' },
    { title: 'pi pi-map-marker' },
    { title: 'pi pi-microsoft' },
    { title: 'pi pi-minus' },
    { title: 'pi pi-minus-circle' },
    { title: 'pi pi-mobile' },
    { title: 'pi pi-money-bill' },
    { title: 'pi pi-moon' },
    { title: 'pi pi-palette' },
    { title: 'pi pi-paperclip' },
    { title: 'pi pi-pause' },
    { title: 'pi pi-paypal' },
    { title: 'pi pi-pencil' },
    { title: 'pi pi-percentage' },
    { title: 'pi pi-phone' },
    { title: 'pi pi-play' },
    { title: 'pi pi-plus' },
    { title: 'pi pi-plus-circle' },
    { title: 'pi pi-pound' },
    { title: 'pi pi-power-off' },
    { title: 'pi pi-prime' },
    { title: 'pi pi-print' },
    { title: 'pi pi-qrcode' },
    { title: 'pi pi-question' },
    { title: 'pi pi-question-circle' },
    { title: 'pi pi-reddit' },
    { title: 'pi pi-refresh' },
    { title: 'pi pi-replay' },
    { title: 'pi pi-reply' },
    { title: 'pi pi-save' },
    { title: 'pi pi-search' },
    { title: 'pi pi-search-minus' },
    { title: 'pi pi-search-plus' },
    { title: 'pi pi-send' },
    { title: 'pi pi-server' },
    { title: 'pi pi-share-alt' },
    { title: 'pi pi-shield' },
    { title: 'pi pi-shopping-bag' },
    { title: 'pi pi-shopping-cart' },
    { title: 'pi pi-sign-in' },
    { title: 'pi pi-sign-out' },
    { title: 'pi pi-sitemap' },
    { title: 'pi pi-slack' },
    { title: 'pi pi-sliders-h' },
    { title: 'pi pi-sliders-v' },
    { title: 'pi pi-sort' },
    { title: 'pi pi-sort-alpha-down' },
    { title: 'pi pi-sort-alpha-down-alt' },
    { title: 'pi pi-sort-alpha-up' },
    { title: 'pi pi-sort-alpha-up-alt' },
    { title: 'pi pi-sort-alt' },
    { title: 'pi pi-sort-alt-slash' },
    { title: 'pi pi-sort-amount-down' },
    { title: 'pi pi-sort-amount-down-alt' },
    { title: 'pi pi-sort-amount-up' },
    { title: 'pi pi-sort-amount-up-alt' },
    { title: 'pi pi-sort-down' },
    { title: 'pi pi-sort-numeric-down' },
    { title: 'pi pi-sort-numeric-down-alt' },
    { title: 'pi pi-sort-numeric-up' },
    { title: 'pi pi-sort-numeric-up-alt' },
    { title: 'pi pi-sort-up' },
    { title: 'pi pi-spinner' },
    { title: 'pi pi-star' },
    { title: 'pi pi-star-fill' },
    { title: 'pi pi-step-backward' },
    { title: 'pi pi-step-backward-alt' },
    { title: 'pi pi-step-forward' },
    { title: 'pi pi-step-forward-alt' },
    { title: 'pi pi-stop' },
    { title: 'pi pi-stop-circle' },
    { title: 'pi pi-sun' },
    { title: 'pi pi-sync' },
    { title: 'pi pi-table' },
    { title: 'pi pi-tablet' },
    { title: 'pi pi-tag' },
    { title: 'pi pi-tags' },
    { title: 'pi pi-telegram' },
    { title: 'pi pi-th-large' },
    { title: 'pi pi-thumbs-down' },
    { title: 'pi pi-thumbs-up' },
    { title: 'pi pi-ticket' },
    { title: 'pi pi-times' },
    { title: 'pi pi-times-circle' },
    { title: 'pi pi-trash' },
    { title: 'pi pi-twitter' },
    { title: 'pi pi-undo' },
    { title: 'pi pi-unlock' },
    { title: 'pi pi-upload' },
    { title: 'pi pi-user' },
    { title: 'pi pi-user-edit' },
    { title: 'pi pi-user-minus' },
    { title: 'pi pi-user-plus' },
    { title: 'pi pi-users' },
    { title: 'pi pi-video' },
    { title: 'pi pi-vimeo' },
    { title: 'pi pi-volume-down' },
    { title: 'pi pi-volume-off' },
    { title: 'pi pi-volume-up' },
    { title: 'pi pi-wallet' },
    { title: 'pi pi-whatsapp' },
    { title: 'pi pi-wifi' },
    { title: 'pi pi-window-maximize' },
    { title: 'pi pi-window-minimize' },
    { title: 'pi pi-youtube' },
    { title: 'bi bi-1-circle' },
    { title: 'bi bi-1-circle-fill' },
    { title: 'bi bi-1-square' },
    { title: 'bi bi-1-square-fill' },
    { title: 'bi bi-123' },
    { title: 'bi bi-2-circle' },
    { title: 'bi bi-2-circle-fill' },
    { title: 'bi bi-2-square' },
    { title: 'bi bi-2-square-fill' },
    { title: 'bi bi-3-circle' },
    { title: 'bi bi-3-circle-fill' },
    { title: 'bi bi-3-square' },
    { title: 'bi bi-3-square-fill' },
    { title: 'bi bi-4-circle' },
    { title: 'bi bi-4-circle-fill' },
    { title: 'bi bi-4-square' },
    { title: 'bi bi-4-square-fill' },
    { title: 'bi bi-5-circle' },
    { title: 'bi bi-5-circle-fill' },
    { title: 'bi bi-5-square' },
    { title: 'bi bi-5-square-fill' },
    { title: 'bi bi-6-circle' },
    { title: 'bi bi-6-circle-fill' },
    { title: 'bi bi-6-square' },
    { title: 'bi bi-6-square-fill' },
    { title: 'bi bi-7-circle' },
    { title: 'bi bi-7-circle-fill' },
    { title: 'bi bi-7-square' },
    { title: 'bi bi-7-square-fill' },
    { title: 'bi bi-8-circle' },
    { title: 'bi bi-8-circle-fill' },
    { title: 'bi bi-8-square' },
    { title: 'bi bi-8-square-fill' },
    { title: 'bi bi-9-circle' },
    { title: 'bi bi-9-circle-fill' },
    { title: 'bi bi-9-square' },
    { title: 'bi bi-9-square-fill' },
    { title: 'bi bi-activity' },
    { title: 'bi bi-airplane' },
    { title: 'bi bi-airplane-engines' },
    { title: 'bi bi-airplane-engines-fill' },
    { title: 'bi bi-airplane-fill' },
    { title: 'bi bi-alarm' },
    { title: 'bi bi-alarm-fill' },
    { title: 'bi bi-alexa' },
    { title: 'bi bi-align-bottom' },
    { title: 'bi bi-align-center' },
    { title: 'bi bi-align-end' },
    { title: 'bi bi-align-middle' },
    { title: 'bi bi-align-start' },
    { title: 'bi bi-align-top' },
    { title: 'bi bi-alipay' },
    { title: 'bi bi-alt' },
    { title: 'bi bi-android' },
    { title: 'bi bi-android2' },
    { title: 'bi bi-app' },
    { title: 'bi bi-app-indicator' },
    { title: 'bi bi-apple' },
    { title: 'bi bi-archive' },
    { title: 'bi bi-archive-fill' },
    { title: 'bi bi-arrow-90deg-down' },
    { title: 'bi bi-arrow-90deg-left' },
    { title: 'bi bi-arrow-90deg-right' },
    { title: 'bi bi-arrow-90deg-up' },
    { title: 'bi bi-arrow-bar-down' },
    { title: 'bi bi-arrow-bar-left' },
    { title: 'bi bi-arrow-bar-right' },
    { title: 'bi bi-arrow-bar-up' },
    { title: 'bi bi-arrow-clockwise' },
    { title: 'bi bi-arrow-counterclockwise' },
    { title: 'bi bi-arrow-down' },
    { title: 'bi bi-arrow-down-circle' },
    { title: 'bi bi-arrow-down-circle-fill' },
    { title: 'bi bi-arrow-down-left-circle' },
    { title: 'bi bi-arrow-down-left-circle-fill' },
    { title: 'bi bi-arrow-down-left-square' },
    { title: 'bi bi-arrow-down-left-square-fill' },
    { title: 'bi bi-arrow-down-right-circle' },
    { title: 'bi bi-arrow-down-right-circle-fill' },
    { title: 'bi bi-arrow-down-right-square' },
    { title: 'bi bi-arrow-down-right-square-fill' },
    { title: 'bi bi-arrow-down-square' },
    { title: 'bi bi-arrow-down-square-fill' },
    { title: 'bi bi-arrow-down-left' },
    { title: 'bi bi-arrow-down-right' },
    { title: 'bi bi-arrow-down-short' },
    { title: 'bi bi-arrow-down-up' },
    { title: 'bi bi-arrow-left' },
    { title: 'bi bi-arrow-left-circle' },
    { title: 'bi bi-arrow-left-circle-fill' },
    { title: 'bi bi-arrow-left-square' },
    { title: 'bi bi-arrow-left-square-fill' },
    { title: 'bi bi-arrow-left-right' },
    { title: 'bi bi-arrow-left-short' },
    { title: 'bi bi-arrow-repeat' },
    { title: 'bi bi-arrow-return-left' },
    { title: 'bi bi-arrow-return-right' },
    { title: 'bi bi-arrow-right' },
    { title: 'bi bi-arrow-right-circle' },
    { title: 'bi bi-arrow-right-circle-fill' },
    { title: 'bi bi-arrow-right-square' },
    { title: 'bi bi-arrow-right-square-fill' },
    { title: 'bi bi-arrow-right-short' },
    { title: 'bi bi-arrow-through-heart' },
    { title: 'bi bi-arrow-through-heart-fill' },
    { title: 'bi bi-arrow-up' },
    { title: 'bi bi-arrow-up-circle' },
    { title: 'bi bi-arrow-up-circle-fill' },
    { title: 'bi bi-arrow-up-left-circle' },
    { title: 'bi bi-arrow-up-left-circle-fill' },
    { title: 'bi bi-arrow-up-left-square' },
    { title: 'bi bi-arrow-up-left-square-fill' },
    { title: 'bi bi-arrow-up-right-circle' },
    { title: 'bi bi-arrow-up-right-circle-fill' },
    { title: 'bi bi-arrow-up-right-square' },
    { title: 'bi bi-arrow-up-right-square-fill' },
    { title: 'bi bi-arrow-up-square' },
    { title: 'bi bi-arrow-up-square-fill' },
    { title: 'bi bi-arrow-up-left' },
    { title: 'bi bi-arrow-up-right' },
    { title: 'bi bi-arrow-up-short' },
    { title: 'bi bi-arrows-angle-contract' },
    { title: 'bi bi-arrows-angle-expand' },
    { title: 'bi bi-arrows-collapse' },
    { title: 'bi bi-arrows-expand' },
    { title: 'bi bi-arrows-fullscreen' },
    { title: 'bi bi-arrows-move' },
    { title: 'bi bi-aspect-ratio' },
    { title: 'bi bi-aspect-ratio-fill' },
    { title: 'bi bi-asterisk' },
    { title: 'bi bi-at' },
    { title: 'bi bi-award' },
    { title: 'bi bi-award-fill' },
    { title: 'bi bi-back' },
    { title: 'bi bi-backspace' },
    { title: 'bi bi-backspace-fill' },
    { title: 'bi bi-backspace-reverse' },
    { title: 'bi bi-backspace-reverse-fill' },
    { title: 'bi bi-badge-3d' },
    { title: 'bi bi-badge-3d-fill' },
    { title: 'bi bi-badge-4k' },
    { title: 'bi bi-badge-4k-fill' },
    { title: 'bi bi-badge-8k' },
    { title: 'bi bi-badge-8k-fill' },
    { title: 'bi bi-badge-ad' },
    { title: 'bi bi-badge-ad-fill' },
    { title: 'bi bi-badge-ar' },
    { title: 'bi bi-badge-ar-fill' },
    { title: 'bi bi-badge-cc' },
    { title: 'bi bi-badge-cc-fill' },
    { title: 'bi bi-badge-hd' },
    { title: 'bi bi-badge-hd-fill' },
    { title: 'bi bi-badge-sd' },
    { title: 'bi bi-badge-sd-fill' },
    { title: 'bi bi-badge-tm' },
    { title: 'bi bi-badge-tm-fill' },
    { title: 'bi bi-badge-vo' },
    { title: 'bi bi-badge-vo-fill' },
    { title: 'bi bi-badge-vr' },
    { title: 'bi bi-badge-vr-fill' },
    { title: 'bi bi-badge-wc' },
    { title: 'bi bi-badge-wc-fill' },
    { title: 'bi bi-bag' },
    { title: 'bi bi-bag-check' },
    { title: 'bi bi-bag-check-fill' },
    { title: 'bi bi-bag-dash' },
    { title: 'bi bi-bag-dash-fill' },
    { title: 'bi bi-bag-fill' },
    { title: 'bi bi-bag-heart' },
    { title: 'bi bi-bag-heart-fill' },
    { title: 'bi bi-bag-plus' },
    { title: 'bi bi-bag-plus-fill' },
    { title: 'bi bi-bag-x' },
    { title: 'bi bi-bag-x-fill' },
    { title: 'bi bi-balloon' },
    { title: 'bi bi-balloon-fill' },
    { title: 'bi bi-balloon-heart' },
    { title: 'bi bi-balloon-heart-fill' },
    { title: 'bi bi-bandaid' },
    { title: 'bi bi-bandaid-fill' },
    { title: 'bi bi-bank' },
    { title: 'bi bi-bank2' },
    { title: 'bi bi-bar-chart' },
    { title: 'bi bi-bar-chart-fill' },
    { title: 'bi bi-bar-chart-line' },
    { title: 'bi bi-bar-chart-line-fill' },
    { title: 'bi bi-bar-chart-steps' },
    { title: 'bi bi-basket' },
    { title: 'bi bi-basket-fill' },
    { title: 'bi bi-basket2' },
    { title: 'bi bi-basket2-fill' },
    { title: 'bi bi-basket3' },
    { title: 'bi bi-basket3-fill' },
    { title: 'bi bi-battery' },
    { title: 'bi bi-battery-charging' },
    { title: 'bi bi-battery-full' },
    { title: 'bi bi-battery-half' },
    { title: 'bi bi-behance' },
    { title: 'bi bi-bell' },
    { title: 'bi bi-bell-fill' },
    { title: 'bi bi-bell-slash' },
    { title: 'bi bi-bell-slash-fill' },
    { title: 'bi bi-bezier' },
    { title: 'bi bi-bezier2' },
    { title: 'bi bi-bicycle' },
    { title: 'bi bi-binoculars' },
    { title: 'bi bi-binoculars-fill' },
    { title: 'bi bi-blockquote-left' },
    { title: 'bi bi-blockquote-right' },
    { title: 'bi bi-bluetooth' },
    { title: 'bi bi-body-text' },
    { title: 'bi bi-book' },
    { title: 'bi bi-book-fill' },
    { title: 'bi bi-book-half' },
    { title: 'bi bi-bookmark' },
    { title: 'bi bi-bookmark-check' },
    { title: 'bi bi-bookmark-check-fill' },
    { title: 'bi bi-bookmark-dash' },
    { title: 'bi bi-bookmark-dash-fill' },
    { title: 'bi bi-bookmark-fill' },
    { title: 'bi bi-bookmark-heart' },
    { title: 'bi bi-bookmark-heart-fill' },
    { title: 'bi bi-bookmark-plus' },
    { title: 'bi bi-bookmark-plus-fill' },
    { title: 'bi bi-bookmark-star' },
    { title: 'bi bi-bookmark-star-fill' },
    { title: 'bi bi-bookmark-x' },
    { title: 'bi bi-bookmark-x-fill' },
    { title: 'bi bi-bookmarks' },
    { title: 'bi bi-bookmarks-fill' },
    { title: 'bi bi-bookshelf' },
    { title: 'bi bi-boombox' },
    { title: 'bi bi-boombox-fill' },
    { title: 'bi bi-bootstrap' },
    { title: 'bi bi-bootstrap-fill' },
    { title: 'bi bi-bootstrap-reboot' },
    { title: 'bi bi-border' },
    { title: 'bi bi-border-all' },
    { title: 'bi bi-border-bottom' },
    { title: 'bi bi-border-center' },
    { title: 'bi bi-border-inner' },
    { title: 'bi bi-border-left' },
    { title: 'bi bi-border-middle' },
    { title: 'bi bi-border-outer' },
    { title: 'bi bi-border-right' },
    { title: 'bi bi-border-style' },
    { title: 'bi bi-border-top' },
    { title: 'bi bi-border-width' },
    { title: 'bi bi-bounding-box' },
    { title: 'bi bi-bounding-box-circles' },
    { title: 'bi bi-box' },
    { title: 'bi bi-box-arrow-down-left' },
    { title: 'bi bi-box-arrow-down-right' },
    { title: 'bi bi-box-arrow-down' },
    { title: 'bi bi-box-arrow-in-down' },
    { title: 'bi bi-box-arrow-in-down-left' },
    { title: 'bi bi-box-arrow-in-down-right' },
    { title: 'bi bi-box-arrow-in-left' },
    { title: 'bi bi-box-arrow-in-right' },
    { title: 'bi bi-box-arrow-in-up' },
    { title: 'bi bi-box-arrow-in-up-left' },
    { title: 'bi bi-box-arrow-in-up-right' },
    { title: 'bi bi-box-arrow-left' },
    { title: 'bi bi-box-arrow-right' },
    { title: 'bi bi-box-arrow-up' },
    { title: 'bi bi-box-arrow-up-left' },
    { title: 'bi bi-box-arrow-up-right' },
    { title: 'bi bi-box-fill' },
    { title: 'bi bi-box-seam' },
    { title: 'bi bi-box-seam-fill' },
    { title: 'bi bi-box2' },
    { title: 'bi bi-box2-fill' },
    { title: 'bi bi-box2-heart' },
    { title: 'bi bi-box2-heart-fill' },
    { title: 'bi bi-boxes' },
    { title: 'bi bi-braces' },
    { title: 'bi bi-braces-asterisk' },
    { title: 'bi bi-bricks' },
    { title: 'bi bi-briefcase' },
    { title: 'bi bi-briefcase-fill' },
    { title: 'bi bi-brightness-alt-high' },
    { title: 'bi bi-brightness-alt-high-fill' },
    { title: 'bi bi-brightness-alt-low' },
    { title: 'bi bi-brightness-alt-low-fill' },
    { title: 'bi bi-brightness-high' },
    { title: 'bi bi-brightness-high-fill' },
    { title: 'bi bi-brightness-low' },
    { title: 'bi bi-brightness-low-fill' },
    { title: 'bi bi-broadcast' },
    { title: 'bi bi-broadcast-pin' },
    { title: 'bi bi-browser-chrome' },
    { title: 'bi bi-browser-edge' },
    { title: 'bi bi-browser-firefox' },
    { title: 'bi bi-browser-safari' },
    { title: 'bi bi-brush' },
    { title: 'bi bi-brush-fill' },
    { title: 'bi bi-bucket' },
    { title: 'bi bi-bucket-fill' },
    { title: 'bi bi-bug' },
    { title: 'bi bi-bug-fill' },
    { title: 'bi bi-building' },
    { title: 'bi bi-bullseye' },
    { title: 'bi bi-c-circle' },
    { title: 'bi bi-c-circle-fill' },
    { title: 'bi bi-c-square' },
    { title: 'bi bi-c-square-fill' },
    { title: 'bi bi-calculator' },
    { title: 'bi bi-calculator-fill' },
    { title: 'bi bi-calendar' },
    { title: 'bi bi-calendar-check' },
    { title: 'bi bi-calendar-check-fill' },
    { title: 'bi bi-calendar-date' },
    { title: 'bi bi-calendar-date-fill' },
    { title: 'bi bi-calendar-day' },
    { title: 'bi bi-calendar-day-fill' },
    { title: 'bi bi-calendar-event' },
    { title: 'bi bi-calendar-event-fill' },
    { title: 'bi bi-calendar-fill' },
    { title: 'bi bi-calendar-heart' },
    { title: 'bi bi-calendar-heart-fill' },
    { title: 'bi bi-calendar-minus' },
    { title: 'bi bi-calendar-minus-fill' },
    { title: 'bi bi-calendar-month' },
    { title: 'bi bi-calendar-month-fill' },
    { title: 'bi bi-calendar-plus' },
    { title: 'bi bi-calendar-plus-fill' },
    { title: 'bi bi-calendar-range' },
    { title: 'bi bi-calendar-range-fill' },
    { title: 'bi bi-calendar-week' },
    { title: 'bi bi-calendar-week-fill' },
    { title: 'bi bi-calendar-x' },
    { title: 'bi bi-calendar-x-fill' },
    { title: 'bi bi-calendar2' },
    { title: 'bi bi-calendar2-check' },
    { title: 'bi bi-calendar2-check-fill' },
    { title: 'bi bi-calendar2-date' },
    { title: 'bi bi-calendar2-date-fill' },
    { title: 'bi bi-calendar2-day' },
    { title: 'bi bi-calendar2-day-fill' },
    { title: 'bi bi-calendar2-event' },
    { title: 'bi bi-calendar2-event-fill' },
    { title: 'bi bi-calendar2-fill' },
    { title: 'bi bi-calendar2-heart' },
    { title: 'bi bi-calendar2-heart-fill' },
    { title: 'bi bi-calendar2-minus' },
    { title: 'bi bi-calendar2-minus-fill' },
    { title: 'bi bi-calendar2-month' },
    { title: 'bi bi-calendar2-month-fill' },
    { title: 'bi bi-calendar2-plus' },
    { title: 'bi bi-calendar2-plus-fill' },
    { title: 'bi bi-calendar2-range' },
    { title: 'bi bi-calendar2-range-fill' },
    { title: 'bi bi-calendar2-week' },
    { title: 'bi bi-calendar2-week-fill' },
    { title: 'bi bi-calendar2-x' },
    { title: 'bi bi-calendar2-x-fill' },
    { title: 'bi bi-calendar3' },
    { title: 'bi bi-calendar3-event' },
    { title: 'bi bi-calendar3-event-fill' },
    { title: 'bi bi-calendar3-fill' },
    { title: 'bi bi-calendar3-range' },
    { title: 'bi bi-calendar3-range-fill' },
    { title: 'bi bi-calendar3-week' },
    { title: 'bi bi-calendar3-week-fill' },
    { title: 'bi bi-calendar4' },
    { title: 'bi bi-calendar4-event' },
    { title: 'bi bi-calendar4-range' },
    { title: 'bi bi-calendar4-week' },
    { title: 'bi bi-camera' },
    { title: 'bi bi-camera2' },
    { title: 'bi bi-camera-fill' },
    { title: 'bi bi-camera-reels' },
    { title: 'bi bi-camera-reels-fill' },
    { title: 'bi bi-camera-video' },
    { title: 'bi bi-camera-video-fill' },
    { title: 'bi bi-camera-video-off' },
    { title: 'bi bi-camera-video-off-fill' },
    { title: 'bi bi-capslock' },
    { title: 'bi bi-capslock-fill' },
    { title: 'bi bi-capsule' },
    { title: 'bi bi-capsule-pill' },
    { title: 'bi bi-car-front' },
    { title: 'bi bi-car-front-fill' },
    { title: 'bi bi-card-checklist' },
    { title: 'bi bi-card-heading' },
    { title: 'bi bi-card-image' },
    { title: 'bi bi-card-list' },
    { title: 'bi bi-card-text' },
    { title: 'bi bi-caret-down' },
    { title: 'bi bi-caret-down-fill' },
    { title: 'bi bi-caret-down-square' },
    { title: 'bi bi-caret-down-square-fill' },
    { title: 'bi bi-caret-left' },
    { title: 'bi bi-caret-left-fill' },
    { title: 'bi bi-caret-left-square' },
    { title: 'bi bi-caret-left-square-fill' },
    { title: 'bi bi-caret-right' },
    { title: 'bi bi-caret-right-fill' },
    { title: 'bi bi-caret-right-square' },
    { title: 'bi bi-caret-right-square-fill' },
    { title: 'bi bi-caret-up' },
    { title: 'bi bi-caret-up-fill' },
    { title: 'bi bi-caret-up-square' },
    { title: 'bi bi-caret-up-square-fill' },
    { title: 'bi bi-cart' },
    { title: 'bi bi-cart-check' },
    { title: 'bi bi-cart-check-fill' },
    { title: 'bi bi-cart-dash' },
    { title: 'bi bi-cart-dash-fill' },
    { title: 'bi bi-cart-fill' },
    { title: 'bi bi-cart-plus' },
    { title: 'bi bi-cart-plus-fill' },
    { title: 'bi bi-cart-x' },
    { title: 'bi bi-cart-x-fill' },
    { title: 'bi bi-cart2' },
    { title: 'bi bi-cart3' },
    { title: 'bi bi-cart4' },
    { title: 'bi bi-cash' },
    { title: 'bi bi-cash-coin' },
    { title: 'bi bi-cash-stack' },
    { title: 'bi bi-cassette' },
    { title: 'bi bi-cassette-fill' },
    { title: 'bi bi-cast' },
    { title: 'bi bi-cc-circle' },
    { title: 'bi bi-cc-circle-fill' },
    { title: 'bi bi-cc-square' },
    { title: 'bi bi-cc-square-fill' },
    { title: 'bi bi-chat' },
    { title: 'bi bi-chat-dots' },
    { title: 'bi bi-chat-dots-fill' },
    { title: 'bi bi-chat-fill' },
    { title: 'bi bi-chat-heart' },
    { title: 'bi bi-chat-heart-fill' },
    { title: 'bi bi-chat-left' },
    { title: 'bi bi-chat-left-dots' },
    { title: 'bi bi-chat-left-dots-fill' },
    { title: 'bi bi-chat-left-fill' },
    { title: 'bi bi-chat-left-heart' },
    { title: 'bi bi-chat-left-heart-fill' },
    { title: 'bi bi-chat-left-quote' },
    { title: 'bi bi-chat-left-quote-fill' },
    { title: 'bi bi-chat-left-text' },
    { title: 'bi bi-chat-left-text-fill' },
    { title: 'bi bi-chat-quote' },
    { title: 'bi bi-chat-quote-fill' },
    { title: 'bi bi-chat-right' },
    { title: 'bi bi-chat-right-dots' },
    { title: 'bi bi-chat-right-dots-fill' },
    { title: 'bi bi-chat-right-fill' },
    { title: 'bi bi-chat-right-heart' },
    { title: 'bi bi-chat-right-heart-fill' },
    { title: 'bi bi-chat-right-quote' },
    { title: 'bi bi-chat-right-quote-fill' },
    { title: 'bi bi-chat-right-text' },
    { title: 'bi bi-chat-right-text-fill' },
    { title: 'bi bi-chat-square' },
    { title: 'bi bi-chat-square-dots' },
    { title: 'bi bi-chat-square-dots-fill' },
    { title: 'bi bi-chat-square-fill' },
    { title: 'bi bi-chat-square-heart' },
    { title: 'bi bi-chat-square-heart-fill' },
    { title: 'bi bi-chat-square-quote' },
    { title: 'bi bi-chat-square-quote-fill' },
    { title: 'bi bi-chat-square-text' },
    { title: 'bi bi-chat-square-text-fill' },
    { title: 'bi bi-chat-text' },
    { title: 'bi bi-chat-text-fill' },
    { title: 'bi bi-check' },
    { title: 'bi bi-check-all' },
    { title: 'bi bi-check-circle' },
    { title: 'bi bi-check-circle-fill' },
    { title: 'bi bi-check-lg' },
    { title: 'bi bi-check-square' },
    { title: 'bi bi-check-square-fill' },
    { title: 'bi bi-check2' },
    { title: 'bi bi-check2-all' },
    { title: 'bi bi-check2-circle' },
    { title: 'bi bi-check2-square' },
    { title: 'bi bi-chevron-bar-contract' },
    { title: 'bi bi-chevron-bar-down' },
    { title: 'bi bi-chevron-bar-expand' },
    { title: 'bi bi-chevron-bar-left' },
    { title: 'bi bi-chevron-bar-right' },
    { title: 'bi bi-chevron-bar-up' },
    { title: 'bi bi-chevron-compact-down' },
    { title: 'bi bi-chevron-compact-left' },
    { title: 'bi bi-chevron-compact-right' },
    { title: 'bi bi-chevron-compact-up' },
    { title: 'bi bi-chevron-contract' },
    { title: 'bi bi-chevron-double-down' },
    { title: 'bi bi-chevron-double-left' },
    { title: 'bi bi-chevron-double-right' },
    { title: 'bi bi-chevron-double-up' },
    { title: 'bi bi-chevron-down' },
    { title: 'bi bi-chevron-expand' },
    { title: 'bi bi-chevron-left' },
    { title: 'bi bi-chevron-right' },
    { title: 'bi bi-chevron-up' },
    { title: 'bi bi-circle' },
    { title: 'bi bi-circle-fill' },
    { title: 'bi bi-circle-half' },
    { title: 'bi bi-slash-circle' },
    { title: 'bi bi-circle-square' },
    { title: 'bi bi-clipboard' },
    { title: 'bi bi-clipboard-check' },
    { title: 'bi bi-clipboard-check-fill' },
    { title: 'bi bi-clipboard-data' },
    { title: 'bi bi-clipboard-data-fill' },
    { title: 'bi bi-clipboard-fill' },
    { title: 'bi bi-clipboard-heart' },
    { title: 'bi bi-clipboard-heart-fill' },
    { title: 'bi bi-clipboard-minus' },
    { title: 'bi bi-clipboard-minus-fill' },
    { title: 'bi bi-clipboard-plus' },
    { title: 'bi bi-clipboard-plus-fill' },
    { title: 'bi bi-clipboard-pulse' },
    { title: 'bi bi-clipboard-x' },
    { title: 'bi bi-clipboard-x-fill' },
    { title: 'bi bi-clipboard2' },
    { title: 'bi bi-clipboard2-check' },
    { title: 'bi bi-clipboard2-check-fill' },
    { title: 'bi bi-clipboard2-data' },
    { title: 'bi bi-clipboard2-data-fill' },
    { title: 'bi bi-clipboard2-fill' },
    { title: 'bi bi-clipboard2-heart' },
    { title: 'bi bi-clipboard2-heart-fill' },
    { title: 'bi bi-clipboard2-minus' },
    { title: 'bi bi-clipboard2-minus-fill' },
    { title: 'bi bi-clipboard2-plus' },
    { title: 'bi bi-clipboard2-plus-fill' },
    { title: 'bi bi-clipboard2-pulse' },
    { title: 'bi bi-clipboard2-pulse-fill' },
    { title: 'bi bi-clipboard2-x' },
    { title: 'bi bi-clipboard2-x-fill' },
    { title: 'bi bi-clock' },
    { title: 'bi bi-clock-fill' },
    { title: 'bi bi-clock-history' },
    { title: 'bi bi-cloud' },
    { title: 'bi bi-cloud-arrow-down' },
    { title: 'bi bi-cloud-arrow-down-fill' },
    { title: 'bi bi-cloud-arrow-up' },
    { title: 'bi bi-cloud-arrow-up-fill' },
    { title: 'bi bi-cloud-check' },
    { title: 'bi bi-cloud-check-fill' },
    { title: 'bi bi-cloud-download' },
    { title: 'bi bi-cloud-download-fill' },
    { title: 'bi bi-cloud-drizzle' },
    { title: 'bi bi-cloud-drizzle-fill' },
    { title: 'bi bi-cloud-fill' },
    { title: 'bi bi-cloud-fog' },
    { title: 'bi bi-cloud-fog-fill' },
    { title: 'bi bi-cloud-fog2' },
    { title: 'bi bi-cloud-fog2-fill' },
    { title: 'bi bi-cloud-hail' },
    { title: 'bi bi-cloud-hail-fill' },
    { title: 'bi bi-cloud-haze' },
    { title: 'bi bi-cloud-haze-fill' },
    { title: 'bi bi-cloud-haze2' },
    { title: 'bi bi-cloud-haze2-fill' },
    { title: 'bi bi-cloud-lightning' },
    { title: 'bi bi-cloud-lightning-fill' },
    { title: 'bi bi-cloud-lightning-rain' },
    { title: 'bi bi-cloud-lightning-rain-fill' },
    { title: 'bi bi-cloud-minus' },
    { title: 'bi bi-cloud-minus-fill' },
    { title: 'bi bi-cloud-moon' },
    { title: 'bi bi-cloud-moon-fill' },
    { title: 'bi bi-cloud-plus' },
    { title: 'bi bi-cloud-plus-fill' },
    { title: 'bi bi-cloud-rain' },
    { title: 'bi bi-cloud-rain-fill' },
    { title: 'bi bi-cloud-rain-heavy' },
    { title: 'bi bi-cloud-rain-heavy-fill' },
    { title: 'bi bi-cloud-slash' },
    { title: 'bi bi-cloud-slash-fill' },
    { title: 'bi bi-cloud-sleet' },
    { title: 'bi bi-cloud-sleet-fill' },
    { title: 'bi bi-cloud-snow' },
    { title: 'bi bi-cloud-snow-fill' },
    { title: 'bi bi-cloud-sun' },
    { title: 'bi bi-cloud-sun-fill' },
    { title: 'bi bi-cloud-upload' },
    { title: 'bi bi-cloud-upload-fill' },
    { title: 'bi bi-clouds' },
    { title: 'bi bi-clouds-fill' },
    { title: 'bi bi-cloudy' },
    { title: 'bi bi-cloudy-fill' },
    { title: 'bi bi-code' },
    { title: 'bi bi-code-slash' },
    { title: 'bi bi-code-square' },
    { title: 'bi bi-coin' },
    { title: 'bi bi-collection' },
    { title: 'bi bi-collection-fill' },
    { title: 'bi bi-collection-play' },
    { title: 'bi bi-collection-play-fill' },
    { title: 'bi bi-columns' },
    { title: 'bi bi-columns-gap' },
    { title: 'bi bi-command' },
    { title: 'bi bi-compass' },
    { title: 'bi bi-compass-fill' },
    { title: 'bi bi-cone' },
    { title: 'bi bi-cone-striped' },
    { title: 'bi bi-controller' },
    { title: 'bi bi-cpu' },
    { title: 'bi bi-cpu-fill' },
    { title: 'bi bi-credit-card' },
    { title: 'bi bi-credit-card-2-back' },
    { title: 'bi bi-credit-card-2-back-fill' },
    { title: 'bi bi-credit-card-2-front' },
    { title: 'bi bi-credit-card-2-front-fill' },
    { title: 'bi bi-credit-card-fill' },
    { title: 'bi bi-crop' },
    { title: 'bi bi-cup' },
    { title: 'bi bi-cup-fill' },
    { title: 'bi bi-cup-hot' },
    { title: 'bi bi-cup-hot-fill' },
    { title: 'bi bi-cup-straw' },
    { title: 'bi bi-currency-bitcoin' },
    { title: 'bi bi-currency-dollar' },
    { title: 'bi bi-currency-euro' },
    { title: 'bi bi-currency-exchange' },
    { title: 'bi bi-currency-pound' },
    { title: 'bi bi-currency-rupee' },
    { title: 'bi bi-currency-yen' },
    { title: 'bi bi-cursor' },
    { title: 'bi bi-cursor-fill' },
    { title: 'bi bi-cursor-text' },
    { title: 'bi bi-dash' },
    { title: 'bi bi-dash-circle' },
    { title: 'bi bi-dash-circle-dotted' },
    { title: 'bi bi-dash-circle-fill' },
    { title: 'bi bi-dash-lg' },
    { title: 'bi bi-dash-square' },
    { title: 'bi bi-dash-square-dotted' },
    { title: 'bi bi-dash-square-fill' },
    { title: 'bi bi-device-hdd' },
    { title: 'bi bi-device-hdd-fill' },
    { title: 'bi bi-device-ssd' },
    { title: 'bi bi-device-ssd-fill' },
    { title: 'bi bi-diagram-2' },
    { title: 'bi bi-diagram-2-fill' },
    { title: 'bi bi-diagram-3' },
    { title: 'bi bi-diagram-3-fill' },
    { title: 'bi bi-diamond' },
    { title: 'bi bi-diamond-fill' },
    { title: 'bi bi-diamond-half' },
    { title: 'bi bi-dice-1' },
    { title: 'bi bi-dice-1-fill' },
    { title: 'bi bi-dice-2' },
    { title: 'bi bi-dice-2-fill' },
    { title: 'bi bi-dice-3' },
    { title: 'bi bi-dice-3-fill' },
    { title: 'bi bi-dice-4' },
    { title: 'bi bi-dice-4-fill' },
    { title: 'bi bi-dice-5' },
    { title: 'bi bi-dice-5-fill' },
    { title: 'bi bi-dice-6' },
    { title: 'bi bi-dice-6-fill' },
    { title: 'bi bi-disc' },
    { title: 'bi bi-disc-fill' },
    { title: 'bi bi-discord' },
    { title: 'bi bi-display' },
    { title: 'bi bi-display-fill' },
    { title: 'bi bi-displayport' },
    { title: 'bi bi-displayport-fill' },
    { title: 'bi bi-distribute-horizontal' },
    { title: 'bi bi-distribute-vertical' },
    { title: 'bi bi-door-closed' },
    { title: 'bi bi-door-closed-fill' },
    { title: 'bi bi-door-open' },
    { title: 'bi bi-door-open-fill' },
    { title: 'bi bi-dot' },
    { title: 'bi bi-download' },
    { title: 'bi bi-dpad' },
    { title: 'bi bi-dpad-fill' },
    { title: 'bi bi-dribbble' },
    { title: 'bi bi-dropbox' },
    { title: 'bi bi-droplet' },
    { title: 'bi bi-droplet-fill' },
    { title: 'bi bi-droplet-half' },
    { title: 'bi bi-ear' },
    { title: 'bi bi-ear-fill' },
    { title: 'bi bi-earbuds' },
    { title: 'bi bi-easel' },
    { title: 'bi bi-easel-fill' },
    { title: 'bi bi-easel2' },
    { title: 'bi bi-easel2-fill' },
    { title: 'bi bi-easel3' },
    { title: 'bi bi-easel3-fill' },
    { title: 'bi bi-egg' },
    { title: 'bi bi-egg-fill' },
    { title: 'bi bi-egg-fried' },
    { title: 'bi bi-eject' },
    { title: 'bi bi-eject-fill' },
    { title: 'bi bi-emoji-angry' },
    { title: 'bi bi-emoji-angry-fill' },
    { title: 'bi bi-emoji-dizzy' },
    { title: 'bi bi-emoji-dizzy-fill' },
    { title: 'bi bi-emoji-expressionless' },
    { title: 'bi bi-emoji-expressionless-fill' },
    { title: 'bi bi-emoji-frown' },
    { title: 'bi bi-emoji-frown-fill' },
    { title: 'bi bi-emoji-heart-eyes' },
    { title: 'bi bi-emoji-heart-eyes-fill' },
    { title: 'bi bi-emoji-kiss' },
    { title: 'bi bi-emoji-kiss-fill' },
    { title: 'bi bi-emoji-laughing' },
    { title: 'bi bi-emoji-laughing-fill' },
    { title: 'bi bi-emoji-neutral' },
    { title: 'bi bi-emoji-neutral-fill' },
    { title: 'bi bi-emoji-smile' },
    { title: 'bi bi-emoji-smile-fill' },
    { title: 'bi bi-emoji-smile-upside-down' },
    { title: 'bi bi-emoji-smile-upside-down-fill' },
    { title: 'bi bi-emoji-sunglasses' },
    { title: 'bi bi-emoji-sunglasses-fill' },
    { title: 'bi bi-emoji-wink' },
    { title: 'bi bi-emoji-wink-fill' },
    { title: 'bi bi-envelope' },
    { title: 'bi bi-envelope-check' },
    { title: 'bi bi-envelope-check-fill' },
    { title: 'bi bi-envelope-dash' },
    { title: 'bi bi-envelope-dash-fill' },
    { title: 'bi bi-envelope-exclamation' },
    { title: 'bi bi-envelope-exclamation-fill' },
    { title: 'bi bi-envelope-fill' },
    { title: 'bi bi-envelope-heart' },
    { title: 'bi bi-envelope-heart-fill' },
    { title: 'bi bi-envelope-open' },
    { title: 'bi bi-envelope-open-fill' },
    { title: 'bi bi-envelope-open-heart' },
    { title: 'bi bi-envelope-open-heart-fill' },
    { title: 'bi bi-envelope-paper' },
    { title: 'bi bi-envelope-paper-fill' },
    { title: 'bi bi-envelope-paper-heart' },
    { title: 'bi bi-envelope-paper-heart-fill' },
    { title: 'bi bi-envelope-plus' },
    { title: 'bi bi-envelope-plus-fill' },
    { title: 'bi bi-envelope-slash' },
    { title: 'bi bi-envelope-slash-fill' },
    { title: 'bi bi-envelope-x' },
    { title: 'bi bi-envelope-x-fill' },
    { title: 'bi bi-eraser' },
    { title: 'bi bi-eraser-fill' },
    { title: 'bi bi-escape' },
    { title: 'bi bi-ethernet' },
    { title: 'bi bi-ev-station' },
    { title: 'bi bi-ev-station-fill' },
    { title: 'bi bi-exclamation' },
    { title: 'bi bi-exclamation-circle' },
    { title: 'bi bi-exclamation-circle-fill' },
    { title: 'bi bi-exclamation-diamond' },
    { title: 'bi bi-exclamation-diamond-fill' },
    { title: 'bi bi-exclamation-lg' },
    { title: 'bi bi-exclamation-octagon' },
    { title: 'bi bi-exclamation-octagon-fill' },
    { title: 'bi bi-exclamation-square' },
    { title: 'bi bi-exclamation-square-fill' },
    { title: 'bi bi-exclamation-triangle' },
    { title: 'bi bi-exclamation-triangle-fill' },
    { title: 'bi bi-exclude' },
    { title: 'bi bi-explicit' },
    { title: 'bi bi-explicit-fill' },
    { title: 'bi bi-eye' },
    { title: 'bi bi-eye-fill' },
    { title: 'bi bi-eye-slash' },
    { title: 'bi bi-eye-slash-fill' },
    { title: 'bi bi-eyedropper' },
    { title: 'bi bi-eyeglasses' },
    { title: 'bi bi-facebook' },
    { title: 'bi bi-fan' },
    { title: 'bi bi-fast-forward' },
    { title: 'bi bi-fast-forward-btn' },
    { title: 'bi bi-fast-forward-btn-fill' },
    { title: 'bi bi-fast-forward-circle' },
    { title: 'bi bi-fast-forward-circle-fill' },
    { title: 'bi bi-fast-forward-fill' },
    { title: 'bi bi-file' },
    { title: 'bi bi-file-arrow-down' },
    { title: 'bi bi-file-arrow-down-fill' },
    { title: 'bi bi-file-arrow-up' },
    { title: 'bi bi-file-arrow-up-fill' },
    { title: 'bi bi-file-bar-graph' },
    { title: 'bi bi-file-bar-graph-fill' },
    { title: 'bi bi-file-binary' },
    { title: 'bi bi-file-binary-fill' },
    { title: 'bi bi-file-break' },
    { title: 'bi bi-file-break-fill' },
    { title: 'bi bi-file-check' },
    { title: 'bi bi-file-check-fill' },
    { title: 'bi bi-file-code' },
    { title: 'bi bi-file-code-fill' },
    { title: 'bi bi-file-diff' },
    { title: 'bi bi-file-diff-fill' },
    { title: 'bi bi-file-earmark' },
    { title: 'bi bi-file-earmark-arrow-down' },
    { title: 'bi bi-file-earmark-arrow-down-fill' },
    { title: 'bi bi-file-earmark-arrow-up' },
    { title: 'bi bi-file-earmark-arrow-up-fill' },
    { title: 'bi bi-file-earmark-bar-graph' },
    { title: 'bi bi-file-earmark-bar-graph-fill' },
    { title: 'bi bi-file-earmark-binary' },
    { title: 'bi bi-file-earmark-binary-fill' },
    { title: 'bi bi-file-earmark-break' },
    { title: 'bi bi-file-earmark-break-fill' },
    { title: 'bi bi-file-earmark-check' },
    { title: 'bi bi-file-earmark-check-fill' },
    { title: 'bi bi-file-earmark-code' },
    { title: 'bi bi-file-earmark-code-fill' },
    { title: 'bi bi-file-earmark-diff' },
    { title: 'bi bi-file-earmark-diff-fill' },
    { title: 'bi bi-file-earmark-easel' },
    { title: 'bi bi-file-earmark-easel-fill' },
    { title: 'bi bi-file-earmark-excel' },
    { title: 'bi bi-file-earmark-excel-fill' },
    { title: 'bi bi-file-earmark-fill' },
    { title: 'bi bi-file-earmark-font' },
    { title: 'bi bi-file-earmark-font-fill' },
    { title: 'bi bi-file-earmark-image' },
    { title: 'bi bi-file-earmark-image-fill' },
    { title: 'bi bi-file-earmark-lock' },
    { title: 'bi bi-file-earmark-lock-fill' },
    { title: 'bi bi-file-earmark-lock2' },
    { title: 'bi bi-file-earmark-lock2-fill' },
    { title: 'bi bi-file-earmark-medical' },
    { title: 'bi bi-file-earmark-medical-fill' },
    { title: 'bi bi-file-earmark-minus' },
    { title: 'bi bi-file-earmark-minus-fill' },
    { title: 'bi bi-file-earmark-music' },
    { title: 'bi bi-file-earmark-music-fill' },
    { title: 'bi bi-file-earmark-pdf' },
    { title: 'bi bi-file-earmark-pdf-fill' },
    { title: 'bi bi-file-earmark-person' },
    { title: 'bi bi-file-earmark-person-fill' },
    { title: 'bi bi-file-earmark-play' },
    { title: 'bi bi-file-earmark-play-fill' },
    { title: 'bi bi-file-earmark-plus' },
    { title: 'bi bi-file-earmark-plus-fill' },
    { title: 'bi bi-file-earmark-post' },
    { title: 'bi bi-file-earmark-post-fill' },
    { title: 'bi bi-file-earmark-ppt' },
    { title: 'bi bi-file-earmark-ppt-fill' },
    { title: 'bi bi-file-earmark-richtext' },
    { title: 'bi bi-file-earmark-richtext-fill' },
    { title: 'bi bi-file-earmark-ruled' },
    { title: 'bi bi-file-earmark-ruled-fill' },
    { title: 'bi bi-file-earmark-slides' },
    { title: 'bi bi-file-earmark-slides-fill' },
    { title: 'bi bi-file-earmark-spreadsheet' },
    { title: 'bi bi-file-earmark-spreadsheet-fill' },
    { title: 'bi bi-file-earmark-text' },
    { title: 'bi bi-file-earmark-text-fill' },
    { title: 'bi bi-file-earmark-word' },
    { title: 'bi bi-file-earmark-word-fill' },
    { title: 'bi bi-file-earmark-x' },
    { title: 'bi bi-file-earmark-x-fill' },
    { title: 'bi bi-file-earmark-zip' },
    { title: 'bi bi-file-earmark-zip-fill' },
    { title: 'bi bi-file-easel' },
    { title: 'bi bi-file-easel-fill' },
    { title: 'bi bi-file-excel' },
    { title: 'bi bi-file-excel-fill' },
    { title: 'bi bi-file-fill' },
    { title: 'bi bi-file-font' },
    { title: 'bi bi-file-font-fill' },
    { title: 'bi bi-file-image' },
    { title: 'bi bi-file-image-fill' },
    { title: 'bi bi-file-lock' },
    { title: 'bi bi-file-lock-fill' },
    { title: 'bi bi-file-lock2' },
    { title: 'bi bi-file-lock2-fill' },
    { title: 'bi bi-file-medical' },
    { title: 'bi bi-file-medical-fill' },
    { title: 'bi bi-file-minus' },
    { title: 'bi bi-file-minus-fill' },
    { title: 'bi bi-file-music' },
    { title: 'bi bi-file-music-fill' },
    { title: 'bi bi-file-pdf' },
    { title: 'bi bi-file-pdf-fill' },
    { title: 'bi bi-file-person' },
    { title: 'bi bi-file-person-fill' },
    { title: 'bi bi-file-play' },
    { title: 'bi bi-file-play-fill' },
    { title: 'bi bi-file-plus' },
    { title: 'bi bi-file-plus-fill' },
    { title: 'bi bi-file-post' },
    { title: 'bi bi-file-post-fill' },
    { title: 'bi bi-file-ppt' },
    { title: 'bi bi-file-ppt-fill' },
    { title: 'bi bi-file-richtext' },
    { title: 'bi bi-file-richtext-fill' },
    { title: 'bi bi-file-ruled' },
    { title: 'bi bi-file-ruled-fill' },
    { title: 'bi bi-file-slides' },
    { title: 'bi bi-file-slides-fill' },
    { title: 'bi bi-file-spreadsheet' },
    { title: 'bi bi-file-spreadsheet-fill' },
    { title: 'bi bi-file-text' },
    { title: 'bi bi-file-text-fill' },
    { title: 'bi bi-file-word' },
    { title: 'bi bi-file-word-fill' },
    { title: 'bi bi-file-x' },
    { title: 'bi bi-file-x-fill' },
    { title: 'bi bi-file-zip' },
    { title: 'bi bi-file-zip-fill' },
    { title: 'bi bi-files' },
    { title: 'bi bi-files-alt' },
    { title: 'bi bi-filetype-aac' },
    { title: 'bi bi-filetype-ai' },
    { title: 'bi bi-filetype-bmp' },
    { title: 'bi bi-filetype-cs' },
    { title: 'bi bi-filetype-css' },
    { title: 'bi bi-filetype-csv' },
    { title: 'bi bi-filetype-doc' },
    { title: 'bi bi-filetype-docx' },
    { title: 'bi bi-filetype-exe' },
    { title: 'bi bi-filetype-gif' },
    { title: 'bi bi-filetype-heic' },
    { title: 'bi bi-filetype-html' },
    { title: 'bi bi-filetype-java' },
    { title: 'bi bi-filetype-jpg' },
    { title: 'bi bi-filetype-js' },
    { title: 'bi bi-filetype-json' },
    { title: 'bi bi-filetype-jsx' },
    { title: 'bi bi-filetype-key' },
    { title: 'bi bi-filetype-m4p' },
    { title: 'bi bi-filetype-md' },
    { title: 'bi bi-filetype-mdx' },
    { title: 'bi bi-filetype-mov' },
    { title: 'bi bi-filetype-mp3' },
    { title: 'bi bi-filetype-mp4' },
    { title: 'bi bi-filetype-otf' },
    { title: 'bi bi-filetype-pdf' },
    { title: 'bi bi-filetype-php' },
    { title: 'bi bi-filetype-png' },
    { title: 'bi bi-filetype-ppt' },
    { title: 'bi bi-filetype-pptx' },
    { title: 'bi bi-filetype-psd' },
    { title: 'bi bi-filetype-py' },
    { title: 'bi bi-filetype-raw' },
    { title: 'bi bi-filetype-rb' },
    { title: 'bi bi-filetype-sass' },
    { title: 'bi bi-filetype-scss' },
    { title: 'bi bi-filetype-sh' },
    { title: 'bi bi-filetype-sql' },
    { title: 'bi bi-filetype-svg' },
    { title: 'bi bi-filetype-tiff' },
    { title: 'bi bi-filetype-tsx' },
    { title: 'bi bi-filetype-ttf' },
    { title: 'bi bi-filetype-txt' },
    { title: 'bi bi-filetype-wav' },
    { title: 'bi bi-filetype-woff' },
    { title: 'bi bi-filetype-xls' },
    { title: 'bi bi-filetype-xlsx' },
    { title: 'bi bi-filetype-xml' },
    { title: 'bi bi-filetype-yml' },
    { title: 'bi bi-film' },
    { title: 'bi bi-filter' },
    { title: 'bi bi-filter-circle' },
    { title: 'bi bi-filter-circle-fill' },
    { title: 'bi bi-filter-left' },
    { title: 'bi bi-filter-right' },
    { title: 'bi bi-filter-square' },
    { title: 'bi bi-filter-square-fill' },
    { title: 'bi bi-fingerprint' },
    { title: 'bi bi-fire' },
    { title: 'bi bi-flag' },
    { title: 'bi bi-flag-fill' },
    { title: 'bi bi-flower1' },
    { title: 'bi bi-flower2' },
    { title: 'bi bi-flower3' },
    { title: 'bi bi-folder' },
    { title: 'bi bi-folder-check' },
    { title: 'bi bi-folder-fill' },
    { title: 'bi bi-folder-minus' },
    { title: 'bi bi-folder-plus' },
    { title: 'bi bi-folder-symlink' },
    { title: 'bi bi-folder-symlink-fill' },
    { title: 'bi bi-folder-x' },
    { title: 'bi bi-folder2' },
    { title: 'bi bi-folder2-open' },
    { title: 'bi bi-fonts' },
    { title: 'bi bi-forward' },
    { title: 'bi bi-forward-fill' },
    { title: 'bi bi-front' },
    { title: 'bi bi-fuel-pump' },
    { title: 'bi bi-fuel-pump-diesel' },
    { title: 'bi bi-fuel-pump-diesel-fill' },
    { title: 'bi bi-fuel-pump-fill' },
    { title: 'bi bi-fullscreen' },
    { title: 'bi bi-fullscreen-exit' },
    { title: 'bi bi-funnel' },
    { title: 'bi bi-funnel-fill' },
    { title: 'bi bi-gear' },
    { title: 'bi bi-gear-fill' },
    { title: 'bi bi-gear-wide' },
    { title: 'bi bi-gear-wide-connected' },
    { title: 'bi bi-gem' },
    { title: 'bi bi-gender-ambiguous' },
    { title: 'bi bi-gender-female' },
    { title: 'bi bi-gender-male' },
    { title: 'bi bi-gender-trans' },
    { title: 'bi bi-geo' },
    { title: 'bi bi-geo-alt' },
    { title: 'bi bi-geo-alt-fill' },
    { title: 'bi bi-geo-fill' },
    { title: 'bi bi-gift' },
    { title: 'bi bi-gift-fill' },
    { title: 'bi bi-git' },
    { title: 'bi bi-github' },
    { title: 'bi bi-globe' },
    { title: 'bi bi-globe2' },
    { title: 'bi bi-google' },
    { title: 'bi bi-google-play' },
    { title: 'bi bi-gpu-card' },
    { title: 'bi bi-graph-down' },
    { title: 'bi bi-graph-down-arrow' },
    { title: 'bi bi-graph-up' },
    { title: 'bi bi-graph-up-arrow' },
    { title: 'bi bi-grid' },
    { title: 'bi bi-grid-1x2' },
    { title: 'bi bi-grid-1x2-fill' },
    { title: 'bi bi-grid-3x2' },
    { title: 'bi bi-grid-3x2-gap' },
    { title: 'bi bi-grid-3x2-gap-fill' },
    { title: 'bi bi-grid-3x3' },
    { title: 'bi bi-grid-3x3-gap' },
    { title: 'bi bi-grid-3x3-gap-fill' },
    { title: 'bi bi-grid-fill' },
    { title: 'bi bi-grip-horizontal' },
    { title: 'bi bi-grip-vertical' },
    { title: 'bi bi-h-circle' },
    { title: 'bi bi-h-circle-fill' },
    { title: 'bi bi-h-square' },
    { title: 'bi bi-h-square-fill' },
    { title: 'bi bi-hammer' },
    { title: 'bi bi-hand-index' },
    { title: 'bi bi-hand-index-fill' },
    { title: 'bi bi-hand-index-thumb' },
    { title: 'bi bi-hand-index-thumb-fill' },
    { title: 'bi bi-hand-thumbs-down' },
    { title: 'bi bi-hand-thumbs-down-fill' },
    { title: 'bi bi-hand-thumbs-up' },
    { title: 'bi bi-hand-thumbs-up-fill' },
    { title: 'bi bi-handbag' },
    { title: 'bi bi-handbag-fill' },
    { title: 'bi bi-hash' },
    { title: 'bi bi-hdd' },
    { title: 'bi bi-hdd-fill' },
    { title: 'bi bi-hdd-network' },
    { title: 'bi bi-hdd-network-fill' },
    { title: 'bi bi-hdd-rack' },
    { title: 'bi bi-hdd-rack-fill' },
    { title: 'bi bi-hdd-stack' },
    { title: 'bi bi-hdd-stack-fill' },
    { title: 'bi bi-hdmi' },
    { title: 'bi bi-hdmi-fill' },
    { title: 'bi bi-headphones' },
    { title: 'bi bi-headset' },
    { title: 'bi bi-headset-vr' },
    { title: 'bi bi-heart' },
    { title: 'bi bi-heart-arrow' },
    { title: 'bi bi-heart-fill' },
    { title: 'bi bi-heart-half' },
    { title: 'bi bi-heart-pulse' },
    { title: 'bi bi-heart-pulse-fill' },
    { title: 'bi bi-heartbreak' },
    { title: 'bi bi-heartbreak-fill' },
    { title: 'bi bi-hearts' },
    { title: 'bi bi-heptagon' },
    { title: 'bi bi-heptagon-fill' },
    { title: 'bi bi-heptagon-half' },
    { title: 'bi bi-hexagon' },
    { title: 'bi bi-hexagon-fill' },
    { title: 'bi bi-hexagon-half' },
    { title: 'bi bi-hospital' },
    { title: 'bi bi-hospital-fill' },
    { title: 'bi bi-hourglass' },
    { title: 'bi bi-hourglass-bottom' },
    { title: 'bi bi-hourglass-split' },
    { title: 'bi bi-hourglass-top' },
    { title: 'bi bi-house' },
    { title: 'bi bi-house-door' },
    { title: 'bi bi-house-door-fill' },
    { title: 'bi bi-house-fill' },
    { title: 'bi bi-house-heart' },
    { title: 'bi bi-house-heart-fill' },
    { title: 'bi bi-hr' },
    { title: 'bi bi-hurricane' },
    { title: 'bi bi-hypnotize' },
    { title: 'bi bi-image' },
    { title: 'bi bi-image-alt' },
    { title: 'bi bi-image-fill' },
    { title: 'bi bi-images' },
    { title: 'bi bi-inbox' },
    { title: 'bi bi-inbox-fill' },
    { title: 'bi bi-inboxes-fill' },
    { title: 'bi bi-inboxes' },
    { title: 'bi bi-incognito' },
    { title: 'bi bi-indent' },
    { title: 'bi bi-infinity' },
    { title: 'bi bi-info' },
    { title: 'bi bi-info-circle' },
    { title: 'bi bi-info-circle-fill' },
    { title: 'bi bi-info-lg' },
    { title: 'bi bi-info-square' },
    { title: 'bi bi-info-square-fill' },
    { title: 'bi bi-input-cursor' },
    { title: 'bi bi-input-cursor-text' },
    { title: 'bi bi-instagram' },
    { title: 'bi bi-intersect' },
    { title: 'bi bi-journal' },
    { title: 'bi bi-journal-album' },
    { title: 'bi bi-journal-arrow-down' },
    { title: 'bi bi-journal-arrow-up' },
    { title: 'bi bi-journal-bookmark' },
    { title: 'bi bi-journal-bookmark-fill' },
    { title: 'bi bi-journal-check' },
    { title: 'bi bi-journal-code' },
    { title: 'bi bi-journal-medical' },
    { title: 'bi bi-journal-minus' },
    { title: 'bi bi-journal-plus' },
    { title: 'bi bi-journal-richtext' },
    { title: 'bi bi-journal-text' },
    { title: 'bi bi-journal-x' },
    { title: 'bi bi-journals' },
    { title: 'bi bi-joystick' },
    { title: 'bi bi-justify' },
    { title: 'bi bi-justify-left' },
    { title: 'bi bi-justify-right' },
    { title: 'bi bi-kanban' },
    { title: 'bi bi-kanban-fill' },
    { title: 'bi bi-key' },
    { title: 'bi bi-key-fill' },
    { title: 'bi bi-keyboard' },
    { title: 'bi bi-keyboard-fill' },
    { title: 'bi bi-ladder' },
    { title: 'bi bi-lamp' },
    { title: 'bi bi-lamp-fill' },
    { title: 'bi bi-laptop' },
    { title: 'bi bi-laptop-fill' },
    { title: 'bi bi-layer-backward' },
    { title: 'bi bi-layer-forward' },
    { title: 'bi bi-layers' },
    { title: 'bi bi-layers-fill' },
    { title: 'bi bi-layers-half' },
    { title: 'bi bi-layout-sidebar' },
    { title: 'bi bi-layout-sidebar-inset-reverse' },
    { title: 'bi bi-layout-sidebar-inset' },
    { title: 'bi bi-layout-sidebar-reverse' },
    { title: 'bi bi-layout-split' },
    { title: 'bi bi-layout-text-sidebar' },
    { title: 'bi bi-layout-text-sidebar-reverse' },
    { title: 'bi bi-layout-text-window' },
    { title: 'bi bi-layout-text-window-reverse' },
    { title: 'bi bi-layout-three-columns' },
    { title: 'bi bi-layout-wtf' },
    { title: 'bi bi-life-preserver' },
    { title: 'bi bi-lightbulb' },
    { title: 'bi bi-lightbulb-fill' },
    { title: 'bi bi-lightbulb-off' },
    { title: 'bi bi-lightbulb-off-fill' },
    { title: 'bi bi-lightning' },
    { title: 'bi bi-lightning-charge' },
    { title: 'bi bi-lightning-charge-fill' },
    { title: 'bi bi-lightning-fill' },
    { title: 'bi bi-line' },
    { title: 'bi bi-link' },
    { title: 'bi bi-link-45deg' },
    { title: 'bi bi-linkedin' },
    { title: 'bi bi-list' },
    { title: 'bi bi-list-check' },
    { title: 'bi bi-list-columns' },
    { title: 'bi bi-list-columns-reverse' },
    { title: 'bi bi-list-nested' },
    { title: 'bi bi-list-ol' },
    { title: 'bi bi-list-stars' },
    { title: 'bi bi-list-task' },
    { title: 'bi bi-list-ul' },
    { title: 'bi bi-lock' },
    { title: 'bi bi-lock-fill' },
    { title: 'bi bi-lungs' },
    { title: 'bi bi-lungs-fill' },
    { title: 'bi bi-magic' },
    { title: 'bi bi-magnet' },
    { title: 'bi bi-magnet-fill' },
    { title: 'bi bi-mailbox' },
    { title: 'bi bi-mailbox2' },
    { title: 'bi bi-map' },
    { title: 'bi bi-map-fill' },
    { title: 'bi bi-markdown' },
    { title: 'bi bi-markdown-fill' },
    { title: 'bi bi-mask' },
    { title: 'bi bi-mastodon' },
    { title: 'bi bi-medium' },
    { title: 'bi bi-megaphone' },
    { title: 'bi bi-megaphone-fill' },
    { title: 'bi bi-memory' },
    { title: 'bi bi-menu-app' },
    { title: 'bi bi-menu-app-fill' },
    { title: 'bi bi-menu-button' },
    { title: 'bi bi-menu-button-fill' },
    { title: 'bi bi-menu-button-wide' },
    { title: 'bi bi-menu-button-wide-fill' },
    { title: 'bi bi-menu-down' },
    { title: 'bi bi-menu-up' },
    { title: 'bi bi-messenger' },
    { title: 'bi bi-meta' },
    { title: 'bi bi-mic' },
    { title: 'bi bi-mic-fill' },
    { title: 'bi bi-mic-mute' },
    { title: 'bi bi-mic-mute-fill' },
    { title: 'bi bi-microsoft' },
    { title: 'bi bi-microsoft-teams' },
    { title: 'bi bi-minecart' },
    { title: 'bi bi-minecart-loaded' },
    { title: 'bi bi-modem' },
    { title: 'bi bi-modem-fill' },
    { title: 'bi bi-moisture' },
    { title: 'bi bi-moon' },
    { title: 'bi bi-moon-fill' },
    { title: 'bi bi-moon-stars' },
    { title: 'bi bi-moon-stars-fill' },
    { title: 'bi bi-mortarboard' },
    { title: 'bi bi-mortarboard-fill' },
    { title: 'bi bi-motherboard' },
    { title: 'bi bi-motherboard-fill' },
    { title: 'bi bi-mouse' },
    { title: 'bi bi-mouse-fill' },
    { title: 'bi bi-mouse2' },
    { title: 'bi bi-mouse2-fill' },
    { title: 'bi bi-mouse3' },
    { title: 'bi bi-mouse3-fill' },
    { title: 'bi bi-music-note' },
    { title: 'bi bi-music-note-beamed' },
    { title: 'bi bi-music-note-list' },
    { title: 'bi bi-music-player' },
    { title: 'bi bi-music-player-fill' },
    { title: 'bi bi-newspaper' },
    { title: 'bi bi-nintendo-switch' },
    { title: 'bi bi-node-minus' },
    { title: 'bi bi-node-minus-fill' },
    { title: 'bi bi-node-plus' },
    { title: 'bi bi-node-plus-fill' },
    { title: 'bi bi-nut' },
    { title: 'bi bi-nut-fill' },
    { title: 'bi bi-octagon' },
    { title: 'bi bi-octagon-fill' },
    { title: 'bi bi-octagon-half' },
    { title: 'bi bi-optical-audio' },
    { title: 'bi bi-optical-audio-fill' },
    { title: 'bi bi-option' },
    { title: 'bi bi-outlet' },
    { title: 'bi bi-p-circle' },
    { title: 'bi bi-p-circle-fill' },
    { title: 'bi bi-p-square' },
    { title: 'bi bi-p-square-fill' },
    { title: 'bi bi-paint-bucket' },
    { title: 'bi bi-palette' },
    { title: 'bi bi-palette-fill' },
    { title: 'bi bi-palette2' },
    { title: 'bi bi-paperclip' },
    { title: 'bi bi-paragraph' },
    { title: 'bi bi-pass' },
    { title: 'bi bi-pass-fill' },
    { title: 'bi bi-patch-check' },
    { title: 'bi bi-patch-check-fill' },
    { title: 'bi bi-patch-exclamation' },
    { title: 'bi bi-patch-exclamation-fill' },
    { title: 'bi bi-patch-minus' },
    { title: 'bi bi-patch-minus-fill' },
    { title: 'bi bi-patch-plus' },
    { title: 'bi bi-patch-plus-fill' },
    { title: 'bi bi-patch-question' },
    { title: 'bi bi-patch-question-fill' },
    { title: 'bi bi-pause' },
    { title: 'bi bi-pause-btn' },
    { title: 'bi bi-pause-btn-fill' },
    { title: 'bi bi-pause-circle' },
    { title: 'bi bi-pause-circle-fill' },
    { title: 'bi bi-pause-fill' },
    { title: 'bi bi-paypal' },
    { title: 'bi bi-pc' },
    { title: 'bi bi-pc-display' },
    { title: 'bi bi-pc-display-horizontal' },
    { title: 'bi bi-pc-horizontal' },
    { title: 'bi bi-pci-card' },
    { title: 'bi bi-peace' },
    { title: 'bi bi-peace-fill' },
    { title: 'bi bi-pen' },
    { title: 'bi bi-pen-fill' },
    { title: 'bi bi-pencil' },
    { title: 'bi bi-pencil-fill' },
    { title: 'bi bi-pencil-square' },
    { title: 'bi bi-pentagon' },
    { title: 'bi bi-pentagon-fill' },
    { title: 'bi bi-pentagon-half' },
    { title: 'bi bi-people' },
    { title: 'bi bi-person-circle' },
    { title: 'bi bi-people-fill' },
    { title: 'bi bi-percent' },
    { title: 'bi bi-person' },
    { title: 'bi bi-person-badge' },
    { title: 'bi bi-person-badge-fill' },
    { title: 'bi bi-person-bounding-box' },
    { title: 'bi bi-person-check' },
    { title: 'bi bi-person-check-fill' },
    { title: 'bi bi-person-dash' },
    { title: 'bi bi-person-dash-fill' },
    { title: 'bi bi-person-fill' },
    { title: 'bi bi-person-heart' },
    { title: 'bi bi-person-hearts' },
    { title: 'bi bi-person-lines-fill' },
    { title: 'bi bi-person-plus' },
    { title: 'bi bi-person-plus-fill' },
    { title: 'bi bi-person-rolodex' },
    { title: 'bi bi-person-square' },
    { title: 'bi bi-person-video' },
    { title: 'bi bi-person-video2' },
    { title: 'bi bi-person-video3' },
    { title: 'bi bi-person-workspace' },
    { title: 'bi bi-person-x' },
    { title: 'bi bi-person-x-fill' },
    { title: 'bi bi-phone' },
    { title: 'bi bi-phone-fill' },
    { title: 'bi bi-phone-flip' },
    { title: 'bi bi-phone-landscape' },
    { title: 'bi bi-phone-landscape-fill' },
    { title: 'bi bi-phone-vibrate' },
    { title: 'bi bi-phone-vibrate-fill' },
    { title: 'bi bi-pie-chart' },
    { title: 'bi bi-pie-chart-fill' },
    { title: 'bi bi-piggy-bank' },
    { title: 'bi bi-piggy-bank-fill' },
    { title: 'bi bi-pin' },
    { title: 'bi bi-pin-angle' },
    { title: 'bi bi-pin-angle-fill' },
    { title: 'bi bi-pin-fill' },
    { title: 'bi bi-pin-map' },
    { title: 'bi bi-pin-map-fill' },
    { title: 'bi bi-pinterest' },
    { title: 'bi bi-pip' },
    { title: 'bi bi-pip-fill' },
    { title: 'bi bi-play' },
    { title: 'bi bi-play-btn' },
    { title: 'bi bi-play-btn-fill' },
    { title: 'bi bi-play-circle' },
    { title: 'bi bi-play-circle-fill' },
    { title: 'bi bi-play-fill' },
    { title: 'bi bi-playstation' },
    { title: 'bi bi-plug' },
    { title: 'bi bi-plug-fill' },
    { title: 'bi bi-plugin' },
    { title: 'bi bi-plus' },
    { title: 'bi bi-plus-circle' },
    { title: 'bi bi-plus-circle-dotted' },
    { title: 'bi bi-plus-circle-fill' },
    { title: 'bi bi-plus-lg' },
    { title: 'bi bi-plus-slash-minus' },
    { title: 'bi bi-plus-square' },
    { title: 'bi bi-plus-square-dotted' },
    { title: 'bi bi-plus-square-fill' },
    { title: 'bi bi-postage' },
    { title: 'bi bi-postage-fill' },
    { title: 'bi bi-postage-heart' },
    { title: 'bi bi-postage-heart-fill' },
    { title: 'bi bi-postcard' },
    { title: 'bi bi-postcard-fill' },
    { title: 'bi bi-postcard-heart' },
    { title: 'bi bi-postcard-heart-fill' },
    { title: 'bi bi-power' },
    { title: 'bi bi-prescription' },
    { title: 'bi bi-prescription2' },
    { title: 'bi bi-printer' },
    { title: 'bi bi-printer-fill' },
    { title: 'bi bi-projector' },
    { title: 'bi bi-projector-fill' },
    { title: 'bi bi-puzzle' },
    { title: 'bi bi-puzzle-fill' },
    { title: 'bi bi-qr-code' },
    { title: 'bi bi-qr-code-scan' },
    { title: 'bi bi-question' },
    { title: 'bi bi-question-circle' },
    { title: 'bi bi-question-diamond' },
    { title: 'bi bi-question-diamond-fill' },
    { title: 'bi bi-question-circle-fill' },
    { title: 'bi bi-question-lg' },
    { title: 'bi bi-question-octagon' },
    { title: 'bi bi-question-octagon-fill' },
    { title: 'bi bi-question-square' },
    { title: 'bi bi-question-square-fill' },
    { title: 'bi bi-quora' },
    { title: 'bi bi-quote' },
    { title: 'bi bi-r-circle' },
    { title: 'bi bi-r-circle-fill' },
    { title: 'bi bi-r-square' },
    { title: 'bi bi-r-square-fill' },
    { title: 'bi bi-radioactive' },
    { title: 'bi bi-rainbow' },
    { title: 'bi bi-receipt' },
    { title: 'bi bi-receipt-cutoff' },
    { title: 'bi bi-reception-0' },
    { title: 'bi bi-reception-1' },
    { title: 'bi bi-reception-2' },
    { title: 'bi bi-reception-3' },
    { title: 'bi bi-reception-4' },
    { title: 'bi bi-record' },
    { title: 'bi bi-record-btn' },
    { title: 'bi bi-record-btn-fill' },
    { title: 'bi bi-record-circle' },
    { title: 'bi bi-record-circle-fill' },
    { title: 'bi bi-record-fill' },
    { title: 'bi bi-record2' },
    { title: 'bi bi-record2-fill' },
    { title: 'bi bi-recycle' },
    { title: 'bi bi-reddit' },
    { title: 'bi bi-repeat' },
    { title: 'bi bi-repeat-1' },
    { title: 'bi bi-reply' },
    { title: 'bi bi-reply-all' },
    { title: 'bi bi-reply-all-fill' },
    { title: 'bi bi-reply-fill' },
    { title: 'bi bi-rewind' },
    { title: 'bi bi-rewind-btn' },
    { title: 'bi bi-rewind-btn-fill' },
    { title: 'bi bi-rewind-circle' },
    { title: 'bi bi-rewind-circle-fill' },
    { title: 'bi bi-rewind-fill' },
    { title: 'bi bi-robot' },
    { title: 'bi bi-router' },
    { title: 'bi bi-router-fill' },
    { title: 'bi bi-rss' },
    { title: 'bi bi-rss-fill' },
    { title: 'bi bi-rulers' },
    { title: 'bi bi-safe' },
    { title: 'bi bi-safe-fill' },
    { title: 'bi bi-safe2' },
    { title: 'bi bi-safe2-fill' },
    { title: 'bi bi-save' },
    { title: 'bi bi-save-fill' },
    { title: 'bi bi-save2' },
    { title: 'bi bi-save2-fill' },
    { title: 'bi bi-scissors' },
    { title: 'bi bi-screwdriver' },
    { title: 'bi bi-sd-card' },
    { title: 'bi bi-sd-card-fill' },
    { title: 'bi bi-search' },
    { title: 'bi bi-search-heart' },
    { title: 'bi bi-search-heart-fill' },
    { title: 'bi bi-segmented-nav' },
    { title: 'bi bi-send' },
    { title: 'bi bi-send-check' },
    { title: 'bi bi-send-check-fill' },
    { title: 'bi bi-send-dash' },
    { title: 'bi bi-send-dash-fill' },
    { title: 'bi bi-send-exclamation' },
    { title: 'bi bi-send-exclamation-fill' },
    { title: 'bi bi-send-fill' },
    { title: 'bi bi-send-plus' },
    { title: 'bi bi-send-plus-fill' },
    { title: 'bi bi-send-slash' },
    { title: 'bi bi-send-slash-fill' },
    { title: 'bi bi-send-x' },
    { title: 'bi bi-send-x-fill' },
    { title: 'bi bi-server' },
    { title: 'bi bi-share' },
    { title: 'bi bi-share-fill' },
    { title: 'bi bi-shield' },
    { title: 'bi bi-shield-check' },
    { title: 'bi bi-shield-exclamation' },
    { title: 'bi bi-shield-fill' },
    { title: 'bi bi-shield-fill-check' },
    { title: 'bi bi-shield-fill-exclamation' },
    { title: 'bi bi-shield-fill-minus' },
    { title: 'bi bi-shield-fill-plus' },
    { title: 'bi bi-shield-fill-x' },
    { title: 'bi bi-shield-lock' },
    { title: 'bi bi-shield-lock-fill' },
    { title: 'bi bi-shield-minus' },
    { title: 'bi bi-shield-plus' },
    { title: 'bi bi-shield-shaded' },
    { title: 'bi bi-shield-slash' },
    { title: 'bi bi-shield-slash-fill' },
    { title: 'bi bi-shield-x' },
    { title: 'bi bi-shift' },
    { title: 'bi bi-shift-fill' },
    { title: 'bi bi-shop' },
    { title: 'bi bi-shop-window' },
    { title: 'bi bi-shuffle' },
    { title: 'bi bi-sign-stop' },
    { title: 'bi bi-sign-stop-fill' },
    { title: 'bi bi-sign-stop-lights' },
    { title: 'bi bi-sign-stop-lights-fill' },
    { title: 'bi bi-sign-turn-left' },
    { title: 'bi bi-sign-turn-left-fill' },
    { title: 'bi bi-sign-turn-right' },
    { title: 'bi bi-sign-turn-right-fill' },
    { title: 'bi bi-sign-turn-slight-left' },
    { title: 'bi bi-sign-turn-slight-left-fill' },
    { title: 'bi bi-sign-turn-slight-right' },
    { title: 'bi bi-sign-turn-slight-right-fill' },
    { title: 'bi bi-sign-yield' },
    { title: 'bi bi-sign-yield-fill' },
    { title: 'bi bi-signal' },
    { title: 'bi bi-signpost' },
    { title: 'bi bi-signpost-2' },
    { title: 'bi bi-signpost-2-fill' },
    { title: 'bi bi-signpost-fill' },
    { title: 'bi bi-signpost-split' },
    { title: 'bi bi-signpost-split-fill' },
    { title: 'bi bi-sim' },
    { title: 'bi bi-sim-fill' },
    { title: 'bi bi-skip-backward' },
    { title: 'bi bi-skip-backward-btn' },
    { title: 'bi bi-skip-backward-btn-fill' },
    { title: 'bi bi-skip-backward-circle' },
    { title: 'bi bi-skip-backward-circle-fill' },
    { title: 'bi bi-skip-backward-fill' },
    { title: 'bi bi-skip-end' },
    { title: 'bi bi-skip-end-btn' },
    { title: 'bi bi-skip-end-btn-fill' },
    { title: 'bi bi-skip-end-circle' },
    { title: 'bi bi-skip-end-circle-fill' },
    { title: 'bi bi-skip-end-fill' },
    { title: 'bi bi-skip-forward' },
    { title: 'bi bi-skip-forward-btn' },
    { title: 'bi bi-skip-forward-btn-fill' },
    { title: 'bi bi-skip-forward-circle' },
    { title: 'bi bi-skip-forward-circle-fill' },
    { title: 'bi bi-skip-forward-fill' },
    { title: 'bi bi-skip-start' },
    { title: 'bi bi-skip-start-btn' },
    { title: 'bi bi-skip-start-btn-fill' },
    { title: 'bi bi-skip-start-circle' },
    { title: 'bi bi-skip-start-circle-fill' },
    { title: 'bi bi-skip-start-fill' },
    { title: 'bi bi-skype' },
    { title: 'bi bi-slack' },
    { title: 'bi bi-slash' },
    { title: 'bi bi-slash-circle-fill' },
    { title: 'bi bi-slash-lg' },
    { title: 'bi bi-slash-square' },
    { title: 'bi bi-slash-square-fill' },
    { title: 'bi bi-sliders' },
    { title: 'bi bi-sliders2' },
    { title: 'bi bi-sliders2-vertical' },
    { title: 'bi bi-smartwatch' },
    { title: 'bi bi-snapchat' },
    { title: 'bi bi-snow' },
    { title: 'bi bi-snow2' },
    { title: 'bi bi-snow3' },
    { title: 'bi bi-sort-alpha-down' },
    { title: 'bi bi-sort-alpha-down-alt' },
    { title: 'bi bi-sort-alpha-up' },
    { title: 'bi bi-sort-alpha-up-alt' },
    { title: 'bi bi-sort-down' },
    { title: 'bi bi-sort-down-alt' },
    { title: 'bi bi-sort-numeric-down' },
    { title: 'bi bi-sort-numeric-down-alt' },
    { title: 'bi bi-sort-numeric-up' },
    { title: 'bi bi-sort-numeric-up-alt' },
    { title: 'bi bi-sort-up' },
    { title: 'bi bi-sort-up-alt' },
    { title: 'bi bi-soundwave' },
    { title: 'bi bi-speaker' },
    { title: 'bi bi-speaker-fill' },
    { title: 'bi bi-speedometer' },
    { title: 'bi bi-speedometer2' },
    { title: 'bi bi-spellcheck' },
    { title: 'bi bi-spotify' },
    { title: 'bi bi-square' },
    { title: 'bi bi-square-fill' },
    { title: 'bi bi-square-half' },
    { title: 'bi bi-stack' },
    { title: 'bi bi-stack-overflow' },
    { title: 'bi bi-star' },
    { title: 'bi bi-star-fill' },
    { title: 'bi bi-star-half' },
    { title: 'bi bi-stars' },
    { title: 'bi bi-steam' },
    { title: 'bi bi-stickies' },
    { title: 'bi bi-stickies-fill' },
    { title: 'bi bi-sticky' },
    { title: 'bi bi-sticky-fill' },
    { title: 'bi bi-stop' },
    { title: 'bi bi-stop-btn' },
    { title: 'bi bi-stop-btn-fill' },
    { title: 'bi bi-stop-circle' },
    { title: 'bi bi-stop-circle-fill' },
    { title: 'bi bi-stop-fill' },
    { title: 'bi bi-stoplights' },
    { title: 'bi bi-stoplights-fill' },
    { title: 'bi bi-stopwatch' },
    { title: 'bi bi-stopwatch-fill' },
    { title: 'bi bi-strava' },
    { title: 'bi bi-subtract' },
    { title: 'bi bi-suit-club' },
    { title: 'bi bi-suit-club-fill' },
    { title: 'bi bi-suit-diamond' },
    { title: 'bi bi-suit-diamond-fill' },
    { title: 'bi bi-suit-heart' },
    { title: 'bi bi-suit-heart-fill' },
    { title: 'bi bi-suit-spade' },
    { title: 'bi bi-suit-spade-fill' },
    { title: 'bi bi-sun' },
    { title: 'bi bi-sun-fill' },
    { title: 'bi bi-sunglasses' },
    { title: 'bi bi-sunrise' },
    { title: 'bi bi-sunrise-fill' },
    { title: 'bi bi-sunset' },
    { title: 'bi bi-sunset-fill' },
    { title: 'bi bi-symmetry-horizontal' },
    { title: 'bi bi-symmetry-vertical' },
    { title: 'bi bi-table' },
    { title: 'bi bi-tablet' },
    { title: 'bi bi-tablet-fill' },
    { title: 'bi bi-tablet-landscape' },
    { title: 'bi bi-tablet-landscape-fill' },
    { title: 'bi bi-tag' },
    { title: 'bi bi-tag-fill' },
    { title: 'bi bi-tags' },
    { title: 'bi bi-tags-fill' },
    { title: 'bi bi-telegram' },
    { title: 'bi bi-telephone' },
    { title: 'bi bi-telephone-fill' },
    { title: 'bi bi-telephone-forward' },
    { title: 'bi bi-telephone-forward-fill' },
    { title: 'bi bi-telephone-inbound' },
    { title: 'bi bi-telephone-inbound-fill' },
    { title: 'bi bi-telephone-minus' },
    { title: 'bi bi-telephone-minus-fill' },
    { title: 'bi bi-telephone-outbound' },
    { title: 'bi bi-telephone-outbound-fill' },
    { title: 'bi bi-telephone-plus' },
    { title: 'bi bi-telephone-plus-fill' },
    { title: 'bi bi-telephone-x' },
    { title: 'bi bi-telephone-x-fill' },
    { title: 'bi bi-terminal' },
    { title: 'bi bi-terminal-dash' },
    { title: 'bi bi-terminal-fill' },
    { title: 'bi bi-terminal-plus' },
    { title: 'bi bi-terminal-split' },
    { title: 'bi bi-terminal-x' },
    { title: 'bi bi-text-center' },
    { title: 'bi bi-text-indent-left' },
    { title: 'bi bi-text-indent-right' },
    { title: 'bi bi-text-left' },
    { title: 'bi bi-text-paragraph' },
    { title: 'bi bi-text-right' },
    { title: 'bi bi-textarea' },
    { title: 'bi bi-textarea-resize' },
    { title: 'bi bi-textarea-t' },
    { title: 'bi bi-thermometer' },
    { title: 'bi bi-thermometer-half' },
    { title: 'bi bi-thermometer-high' },
    { title: 'bi bi-thermometer-low' },
    { title: 'bi bi-thermometer-snow' },
    { title: 'bi bi-thermometer-sun' },
    { title: 'bi bi-three-dots' },
    { title: 'bi bi-three-dots-vertical' },
    { title: 'bi bi-thunderbolt' },
    { title: 'bi bi-thunderbolt-fill' },
    { title: 'bi bi-ticket' },
    { title: 'bi bi-ticket-detailed' },
    { title: 'bi bi-ticket-detailed-fill' },
    { title: 'bi bi-ticket-fill' },
    { title: 'bi bi-ticket-perforated' },
    { title: 'bi bi-ticket-perforated-fill' },
    { title: 'bi bi-tiktok' },
    { title: 'bi bi-toggle-off' },
    { title: 'bi bi-toggle-on' },
    { title: 'bi bi-toggle2-off' },
    { title: 'bi bi-toggle2-on' },
    { title: 'bi bi-toggles' },
    { title: 'bi bi-toggles2' },
    { title: 'bi bi-tools' },
    { title: 'bi bi-tornado' },
    { title: 'bi bi-train-freight-front' },
    { title: 'bi bi-train-freight-front-fill' },
    { title: 'bi bi-train-front' },
    { title: 'bi bi-train-front-fill' },
    { title: 'bi bi-train-lightrail-front' },
    { title: 'bi bi-train-lightrail-front-fill' },
    { title: 'bi bi-translate' },
    { title: 'bi bi-trash' },
    { title: 'bi bi-trash-fill' },
    { title: 'bi bi-trash2' },
    { title: 'bi bi-trash2-fill' },
    { title: 'bi bi-trash3' },
    { title: 'bi bi-trash3-fill' },
    { title: 'bi bi-tree' },
    { title: 'bi bi-tree-fill' },
    { title: 'bi bi-triangle' },
    { title: 'bi bi-triangle-fill' },
    { title: 'bi bi-triangle-half' },
    { title: 'bi bi-trophy' },
    { title: 'bi bi-trophy-fill' },
    { title: 'bi bi-tropical-storm' },
    { title: 'bi bi-truck' },
    { title: 'bi bi-truck-flatbed' },
    { title: 'bi bi-truck-front' },
    { title: 'bi bi-truck-front-fill' },
    { title: 'bi bi-tsunami' },
    { title: 'bi bi-tv' },
    { title: 'bi bi-tv-fill' },
    { title: 'bi bi-twitch' },
    { title: 'bi bi-twitter' },
    { title: 'bi bi-type' },
    { title: 'bi bi-type-bold' },
    { title: 'bi bi-type-h1' },
    { title: 'bi bi-type-h2' },
    { title: 'bi bi-type-h3' },
    { title: 'bi bi-type-italic' },
    { title: 'bi bi-type-strikethrough' },
    { title: 'bi bi-type-underline' },
    { title: 'bi bi-ubuntu' },
    { title: 'bi bi-ui-checks' },
    { title: 'bi bi-ui-checks-grid' },
    { title: 'bi bi-ui-radios' },
    { title: 'bi bi-ui-radios-grid' },
    { title: 'bi bi-umbrella' },
    { title: 'bi bi-umbrella-fill' },
    { title: 'bi bi-unindent' },
    { title: 'bi bi-union' },
    { title: 'bi bi-unity' },
    { title: 'bi bi-universal-access' },
    { title: 'bi bi-universal-access-circle' },
    { title: 'bi bi-unlock' },
    { title: 'bi bi-unlock-fill' },
    { title: 'bi bi-upc' },
    { title: 'bi bi-upc-scan' },
    { title: 'bi bi-upload' },
    { title: 'bi bi-usb' },
    { title: 'bi bi-usb-c' },
    { title: 'bi bi-usb-c-fill' },
    { title: 'bi bi-usb-drive' },
    { title: 'bi bi-usb-drive-fill' },
    { title: 'bi bi-usb-fill' },
    { title: 'bi bi-usb-micro' },
    { title: 'bi bi-usb-micro-fill' },
    { title: 'bi bi-usb-mini' },
    { title: 'bi bi-usb-mini-fill' },
    { title: 'bi bi-usb-plug' },
    { title: 'bi bi-usb-plug-fill' },
    { title: 'bi bi-usb-symbol' },
    { title: 'bi bi-valentine' },
    { title: 'bi bi-valentine2' },
    { title: 'bi bi-vector-pen' },
    { title: 'bi bi-view-list' },
    { title: 'bi bi-view-stacked' },
    { title: 'bi bi-vimeo' },
    { title: 'bi bi-vinyl' },
    { title: 'bi bi-vinyl-fill' },
    { title: 'bi bi-virus' },
    { title: 'bi bi-virus2' },
    { title: 'bi bi-voicemail' },
    { title: 'bi bi-volume-down' },
    { title: 'bi bi-volume-down-fill' },
    { title: 'bi bi-volume-mute' },
    { title: 'bi bi-volume-mute-fill' },
    { title: 'bi bi-volume-off' },
    { title: 'bi bi-volume-off-fill' },
    { title: 'bi bi-volume-up' },
    { title: 'bi bi-volume-up-fill' },
    { title: 'bi bi-vr' },
    { title: 'bi bi-wallet' },
    { title: 'bi bi-wallet-fill' },
    { title: 'bi bi-wallet2' },
    { title: 'bi bi-watch' },
    { title: 'bi bi-water' },
    { title: 'bi bi-webcam' },
    { title: 'bi bi-webcam-fill' },
    { title: 'bi bi-wechat' },
    { title: 'bi bi-whatsapp' },
    { title: 'bi bi-wifi' },
    { title: 'bi bi-wifi-1' },
    { title: 'bi bi-wifi-2' },
    { title: 'bi bi-wifi-off' },
    { title: 'bi bi-wind' },
    { title: 'bi bi-window' },
    { title: 'bi bi-window-dash' },
    { title: 'bi bi-window-desktop' },
    { title: 'bi bi-window-dock' },
    { title: 'bi bi-window-fullscreen' },
    { title: 'bi bi-window-plus' },
    { title: 'bi bi-window-sidebar' },
    { title: 'bi bi-window-split' },
    { title: 'bi bi-window-stack' },
    { title: 'bi bi-window-x' },
    { title: 'bi bi-windows' },
    { title: 'bi bi-wordpress' },
    { title: 'bi bi-wrench' },
    { title: 'bi bi-wrench-adjustable' },
    { title: 'bi bi-wrench-adjustable-circle' },
    { title: 'bi bi-wrench-adjustable-circle-fill' },
    { title: 'bi bi-x' },
    { title: 'bi bi-x-circle' },
    { title: 'bi bi-x-circle-fill' },
    { title: 'bi bi-x-diamond' },
    { title: 'bi bi-x-diamond-fill' },
    { title: 'bi bi-x-lg' },
    { title: 'bi bi-x-octagon' },
    { title: 'bi bi-x-octagon-fill' },
    { title: 'bi bi-x-square' },
    { title: 'bi bi-x-square-fill' },
    { title: 'bi bi-xbox' },
    { title: 'bi bi-yelp' },
    { title: 'bi bi-yin-yang' },
    { title: 'bi bi-youtube' },
    { title: 'bi bi-zoom-in' },
    { title: 'bi bi-zoom-out' },
  ];

  convert({ ...data }, media?: { file: any; title: string }[]): FormData {
    let formData = new FormData();
    for (let key of Object.keys(data)) {
      if (data.hasOwnProperty(key) && data[key] !== undefined) {
        formData.set(key, JSON.stringify(data[key]));
      }
    }
    if (media && media.length) {
      media.forEach((item) => {
        if (item.file instanceof Array) {
          if (item.file.length) {
            formData.delete(item.title);
            item.file.map((file: any) => {
              formData.append(item.title, file);
            });
          }
        } else if (item.file) {
          formData.set(item.title, item.file);
        }
        item.file = null;
      });
    }

    return formData;
  }

  fixUrl(url: string) {
    if (!url || url.startsWith('/')) return url;
    if (!url.startsWith('http')) return `http://${url}`;
    return url.replace(/https:/, 'http:');
  }

  fixImage(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url.replace(/https:/, 'http:');
    return `assets/${url}`;
  }

  export(data: any[], fileName: string) {
    function saveAsExcelFile(buffer: any, fileName: string): void {
      import('file-saver-es').then((FileSaver) => {
        let EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
          data,
          `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
        );
      });
    }
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { users: worksheet }, SheetNames: [fileName] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      saveAsExcelFile(excelBuffer, fileName);
    });
  }

  isBetween(
    value: number,
    start: number,
    end: number,
    includesStart = true,
    includesEnd = true
  ): boolean {
    return (
      (includesStart ? value >= start : value > start) &&
      (includesEnd ? value <= end : value < end)
    );
  }

  removeAccent(s: string) {
    return s
      ? s
        .replace(/ç/g, 'c')
        .replace(/Ç/g, 'C')
        .replace(/ñ/g, 'n')
        .replace(/Ñ/g, 'N')
        .replace(/œ/g, 'oe')
        .replace(/Œ/g, 'OE')
        .replace(/æ/g, 'ae')
        .replace(/Æ/g, 'AE')
        .replace(/[ýÿ]/g, 'y')
        .replace(/[ÝŸ]/g, 'Y')
        .replace(/[ÙÚÛÜ]/g, 'U')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ÈÉÊË]/g, 'E')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[ÌÍÎÏ]/g, 'I')
        .replace(/[ÒÓÔÕÖ]/g, 'O')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[ÀÁÂÃÄÅ]/g, 'A')
      : s;
  }

  find(findIn: string, findBy: string): boolean {
    if (!(findIn && findBy)) return false;
    findIn = this.removeAccent(findIn.toLowerCase());
    findBy = this.removeAccent(findBy.toLowerCase());
    let [first, ...other] = findBy.split('');
    if (findIn.includes(first))
      return other.length
        ? this.find(findIn.substring(findIn.indexOf(first) + 1), other.join(''))
        : true;
    return false;
  }

  filterByFitness(arr: any[], testString: string, valuePath: string) {
    const calcFitness = (findIn: string, findBy: string) => {
      if (!(findIn && findBy)) return -100;
      let fitness = 0;
      findIn = this.removeAccent(findIn.toLowerCase());
      findBy = this.removeAccent(findBy.toLowerCase());
      let [first, ...rest] = findBy.split('');
      if (findIn.includes(first)) {
        let indexOf = findIn.indexOf(first);
        if (indexOf === 0) fitness += 10;
        if (rest.length) {
          fitness -= indexOf - 1;
          fitness += calcFitness(findIn.substring(indexOf + 1), rest.join(''));
        } else fitness -= indexOf - 1 + findIn.substring(indexOf + 1).length;
        return fitness;
      }
      return -100;
    };
    return arr
      .filter(
        (item) =>
          calcFitness(this.getValueByPath(item, valuePath), testString) >= 0
      )
      .sort(
        (aItem, bItem) =>
          calcFitness(this.getValueByPath(bItem, valuePath), testString) -
          calcFitness(this.getValueByPath(aItem, valuePath), testString)
      );
  }

  /*newObject<T = any>(data: T): T {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
  }
*/
  /* newObject<T = any>(obj: T): T {
     // return JSON.parse(JSON.stringify(obj))
     const deepClone = (obj: T, clonedObjects = new WeakMap<any, any>()) => {
       if (obj === undefined || obj === null || typeof obj !== "object") {
         return obj;
       }
       if (obj instanceof Date) {
         return new Date(obj.getTime()) as any;
       }
       if (obj instanceof RegExp) {
         return new RegExp(obj) as any;
       }
       if (obj instanceof Map) {
         const newMap: any = new Map();
         obj.forEach((value, key) => {
           newMap.set(deepClone(key, clonedObjects), deepClone(value, clonedObjects));
         });
         return newMap;
       }
       if (obj instanceof Set) {
         const newSet: any = new Set();
         obj.forEach((value) => {
           newSet.add(deepClone(value, clonedObjects));
         });
       }
       if (obj instanceof Symbol) {
         return Symbol(obj.description);
       }
       if (Array.isArray(obj)) {
         const newArray: any = [];
         clonedObjects.set(obj, newArray);
         for (let index = 0; index < obj.length; index++) {
           newArray[index] = deepClone(obj[index], clonedObjects);
         }
         return newArray;
       }
       if (clonedObjects.has(obj)) {
         return clonedObjects.get(obj);
       }
       const newObj: any = {};
       clonedObjects.set(obj, newObj);
       Object.keys(obj).forEach((key) => {
         newObj[key] = deepClone((obj as any)[key], clonedObjects);
       });
       return newObj;
     };
     return deepClone(obj);
   }*/

  newObject<T = any>(obj: T): T {
    // return JSON.parse(JSON.stringify(obj))
    const deepClone = (obj: T, clonedObjects = new WeakMap<any, any>()) => {
      if (obj === undefined || obj === null || typeof obj !== 'object') {
        return obj;
      }
      // Check if the object has already been cloned
      if (clonedObjects.has(obj)) {
        return clonedObjects.get(obj);
      }
      // Handle specific types like Date, RegExp, Map, Set, etc.
      if (obj instanceof Date) {
        return new Date(obj.getTime()) as any;
      }
      if (obj instanceof RegExp) {
        return new RegExp(obj) as any;
      }
      if (obj instanceof Map) {
        const newMap: any = new Map();
        obj.forEach((value, key) => {
          newMap.set(
            deepClone(key, clonedObjects),
            deepClone(value, clonedObjects)
          );
        });
        return newMap;
      }
      if (obj instanceof Set) {
        const newSet: any = new Set();
        obj.forEach((value) => {
          newSet.add(deepClone(value, clonedObjects));
        });
      }
      if (obj instanceof Symbol) {
        return Symbol(obj.description);
      }
      if (Array.isArray(obj)) {
        const newArray: any = [];
        clonedObjects.set(obj, newArray);
        for (let index = 0; index < obj.length; index++) {
          newArray[index] = deepClone(obj[index], clonedObjects);
        }
        return newArray;
      }
      const newObj: any = {};
      clonedObjects.set(obj, newObj);
      Object.keys(obj).forEach((key) => {
        newObj[key] = deepClone((obj as any)[key], clonedObjects);
      });
      return newObj;
    };
    return deepClone(obj);
  }

  updateObject(obj: any, val: any) {
    Object.keys(val || {}).map((k) => {
      obj[k] = val[k];
    });
  }

  updateObjectStrict(obj: any, val: any) {
    Object.keys(val || {}).map(
      (k) =>
        Object.keys(obj || {}).includes(k) &&
        (typeof obj[k] === 'object' && !(obj[k] instanceof Array)
          ? this.updateObjectStrict(obj[k], val[k])
          : (obj[k] = val[k]))
    );
  }

  getValueByPath(obj: any, path: string): any {
    if (!(obj && path)) return obj;
    let [first, ...rest] = path.split('.');
    return rest.length
      ? obj[first] instanceof Array && isNaN(+rest[0])
        ? obj[first].map((d: any) => this.getValueByPath(d, rest.join('.')))
        : this.getValueByPath(obj[first], rest.join('.'))
      : obj[first];
  }

  setValueByPath(
    obj: any,
    path: string,
    options: SetValueByPathOptions = {}
  ): void {
    if (!(obj && typeof obj === 'object' && path)) return obj;
    let [first, ...rest] = path.split('.');
    if (Array.isArray(obj)) {
      if (isNaN(Number(first))) {
        obj.forEach((item) => {
          this.setValueByPath(item, path, options);
        });
      } else {
        this.setValueByPath(obj[first as any], rest.join('.'), options);
      }
    } else {
      const { value, pipes } = options;
      rest.length
        ? obj[first] instanceof Array && isNaN(+rest[0])
          ? obj[first].map((val: any) =>
            this.setValueByPath(val, rest.join('.'), options)
          )
          : this.setValueByPath(obj[first], rest.join('.'), options)
        : obj[first] instanceof Array
          ? (obj[first] = obj[first].map((d: any) =>
            (pipes || []).reduce(
              (currentVal, fn) =>
                typeof fn === 'function' ? fn(currentVal) : currentVal,
              value?.path !== undefined
                ? this.getValueByPath(value.obj ?? d, value.path) ?? d
                : value ?? d
            )
          ))
          : (obj[first] = (pipes || []).reduce(
            (currentVal, fn) =>
              typeof fn === 'function' ? fn(currentVal) : currentVal,
            value?.path !== undefined
              ? this.getValueByPath(value.obj ?? obj[first], value.path) ??
              obj[first]
              : value ?? obj[first]
          ));
    }
  }

  setValuesByPaths(
    obj: any,
    paths: (
      | string
      | [string, string]
      | [string, string, boolean]
      | { path: string; options: SetValueByPathOptions }
    )[]
  ) {
    paths.map((p) => {
      typeof p === 'string'
        ? this.setValueByPath(obj, p, { value: { path: '_id' } })
        : Array.isArray(p)
          ? p.length === 3
            ? p[2] &&
            this.setValueByPath(obj, p[0], { value: { path: p[1] || '' } })
            : this.setValueByPath(obj, p[0], { value: { path: p[1] || '' } })
          : p.options?.when !== undefined
            ? p.options.when && this.setValueByPath(obj, p.path, p.options)
            : this.setValueByPath(obj, p.path, p.options);
    });
  }

  /*  setValueByPath(
      obj: any,
      path: string,
      value: {
        value?: any;
        path?: string;
        obj?: any;
      } = {}
    ) {
      let [first, ...rest] = path.split('.');
      rest.length
        ? obj[first] instanceof Array && isNaN(+rest[0])
          ? obj[first].map((val: any) =>
              this.setValueByPath(val, rest.join('.'), value)
            )
          : this.setValueByPath(obj[first], rest.join('.'), value)
        : obj[first] instanceof Array
        ? (obj[first] = obj[first].map((d: any) =>
            value?.value != undefined
              ? value?.value
              : this.getValueByPath(value?.obj || d, value?.path || '')
          ))
        : (obj[first] =
            value?.value != undefined
              ? value?.value
              : this.getValueByPath(
                  value?.obj || obj[first],
                  value?.path || ''
                ) ?? obj[first]);
    }
    setValuesByPaths(
      obj: any,
      paths: (
        | string
        | [string, string]
        | {
            path: string;
            value: {
              value?: any;
              path?: any;
              obj?: any;
            };
          }
      )[]
    ) {
      paths.map((p) => {
        typeof p === 'string'
          ? this.setValueByPath(obj, p, { path: '_id' })
          : p instanceof Array
          ? this.setValueByPath(obj, p[0], { path: p[1] || '' })
          : this.setValueByPath(obj, p.path, p.value);
      });
    }*/

  deleteAttributeByPath(obj: any, path: string) {
    if (!obj) return;
    let [first, ...rest] = path.split('.');
    rest.length
      ? obj[first] instanceof Array
        ? isNaN(+rest[0])
          ? obj[first].map((d: any) =>
            this.deleteAttributeByPath(d, rest.join('.'))
          )
          : this.deleteAttributeByPath(
            obj[first][+rest[0]],
            rest.slice(1).join('.')
          )
        : this.deleteAttributeByPath(obj[first], rest.join('.'))
      : delete obj[first];
  }

  deleteAttributesByPath(obj: any, paths: string[]) {
    paths.map((p) => {
      this.deleteAttributeByPath(obj, p);
    });
  }

  titleCase(str: string) {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getI18nValue(i18n: any) {
    if (typeof i18n === 'object' && i18n.length) {
      return (
        i18n.find(
          (item: any) => item.language === this.secureStorage.getItem('lang')
        ) || i18n[0]
      );
    } else {
      return i18n;
    }
  }

  translateTitle(data: any) {
    let value = '';
    this.translateService.get(data).subscribe((t) => {
      value = t;
    });
    return value;
  }

  translateValues(data: any) {
    let value: any = [];
    return this.resolve((res, rej) => {
      this.translateService.get(data).subscribe({
        next: (translations: any) => {
          for (let key of Object.keys(translations)) {
            value.push({ value: key, label: translations[key] });
          }
          res(value);
        },
        error: ({ error }: any) => {
          console.error('error', error);
          rej(error);
        },
      });
    });
  }

  resolve<T = any>(
    cb: (
      res: (value: T | PromiseLike<T>) => void,
      rej: (reason?: any) => void
    ) => void
  ): Promise<T> {
    return new Promise(async (res, rej) => {
      try {
        await cb(res, rej);
      } catch (error) {
        rej(error);
      }
    });
  }

  insertAt<T = any>(arr: T[], value: any, index: number, spread = false) {
    spread ? arr.splice(index, 0, ...value) : arr.splice(index, 0, value);
    return arr;
  }

  insertIntoArrayByOrder<T = any>(
    arr: T[],
    value: T,
    options?: {
      lastIndex?: number;
      firstIndex?: number;
      pathValueForCompare?: string;
      arrayOrder?: 'asc' | 'desc';
    }
  ) {
    if (arr.length === 0) {
      arr.push(value);
      return arr;
    }
    options ||= {
      lastIndex: arr.length,
      firstIndex: 0,
      pathValueForCompare: '',
      arrayOrder: 'asc',
    };
    options.lastIndex ||= arr.length;
    options.firstIndex ||= 0;
    options.pathValueForCompare ||= '';
    options.arrayOrder ||= 'asc';
    arr.sort((a, b) => {
      return options?.arrayOrder === 'desc'
        ? this.getValueByPath(b, options.pathValueForCompare || '') >=
          this.getValueByPath(a, options.pathValueForCompare || '')
          ? 1
          : -1
        : this.getValueByPath(b, options?.pathValueForCompare || '') >=
          this.getValueByPath(a, options?.pathValueForCompare || '')
          ? -1
          : 1;
    });
    if (options.arrayOrder === 'desc') {
      if (
        // @ts-ignore
        this.getValueByPath(arr.at(-1), options.pathValueForCompare || '') >=
        this.getValueByPath(value, options.pathValueForCompare || '')
      ) {
        arr.push(value);
        return arr;
      } else if (
        // @ts-ignore
        this.getValueByPath(arr.at(0), options.pathValueForCompare || '') <=
        this.getValueByPath(value, options.pathValueForCompare || '')
      ) {
        arr.unshift(value);
        return arr;
      }
    } else {
      if (
        // @ts-ignore
        this.getValueByPath(arr.at(-1), options.pathValueForCompare || '') <=
        this.getValueByPath(value, options.pathValueForCompare || '')
      ) {
        arr.push(value);
        return arr;
      } else if (
        // @ts-ignore
        this.getValueByPath(arr.at(0), options.pathValueForCompare || '') >=
        this.getValueByPath(value, options.pathValueForCompare || '')
      ) {
        arr.unshift(value);
        return arr;
      }
    }
    const insertFunction = (value: any, options: any) => {
      let index = Math.floor(
        options.firstIndex + (options.lastIndex - options.firstIndex) / 2
      );
      if (options.arrayOrder === 'desc') {
        if (
          this.getValueByPath(arr[index], options.pathValueForCompare) <=
          this.getValueByPath(value, options.pathValueForCompare)
        ) {
          options.lastIndex = index;
        } else {
          options.firstIndex = index + 1;
        }
      } else {
        if (
          this.getValueByPath(arr[index], options.pathValueForCompare) >=
          this.getValueByPath(value, options.pathValueForCompare)
        ) {
          options.lastIndex = index;
        } else {
          options.firstIndex = index + 1;
        }
      }
      if (options.firstIndex !== options.lastIndex) {
        insertFunction(value, options);
      } else {
        this.insertAt(arr, value, options.firstIndex);
      }
      return arr;
    };
    return insertFunction(value, options);
  }

  getRandomValueFromAnArray<T = any>(arr: T[]) {
    return arr[this.random({ floor: true, max: arr.length })];
  }

  mapValue(
    value: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number,
    withinBounds = false
  ) {
    const newval =
      ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    return !withinBounds
      ? newval
      : start2 < stop2
        ? this.constrain(newval, start2, stop2)
        : this.constrain(newval, stop2, start2);
  }

  dataURLtoFile(dataurl: any, fileName: string) {
    let arr = dataurl.split(','),
      mime = arr[0]?.match(/:(.*?);/)?.[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], `${fileName}.${mime?.split('/')[1]}`, {
      type: mime,
    });
    return file;
  }

  constrain(value: number, low: number, high: number) {
    return Math.max(Math.min(value, high), low);
  }

  random(
    {
      min = 0,
      max = 1,
      floor = false,
    }: {
      min?: number;
      max?: number;
      floor?: boolean;
    } = {
        min: 0,
        max: 1,
        floor: false,
      }
  ) {
    min > max && (max = min);
    let rnd = Math.random() * (max - min) + min;
    return floor ? Math.floor(rnd) : rnd;
  }

  generateReference(prefix: string, i: number = 0) {
    return `${prefix}${Date.now()}${Math.floor(
      Math.random() * (9 - 0 + 1) + 0
    )}${i}`;
  }

  dateDiff(endDate: any, startDate: any) {
    let diff: any = {};
    let tmp = endDate - startDate;
    tmp = Math.floor(tmp / 1000);
    diff.sec = tmp % 60;
    tmp = Math.floor((tmp - diff.sec) / 60);
    diff.min = tmp % 60;
    tmp = Math.floor((tmp - diff.min) / 60);
    diff.hour = tmp % 24;
    tmp = Math.floor((tmp - diff.hour) / 24);
    diff.day = tmp;
    return diff;
  }

  sleep(ms: number) {
    return new Promise((res) => {
      setTimeout(res, ms || 0);
    });
  }

  flatDeep(arr: any, attribute: string) {
    return arr.reduce(
      (acc: any, val: any) =>
        acc.concat(
          (attribute ? val[attribute] : val) &&
            (attribute ? val[attribute] : val).length
            ? [val].concat(
              this.flatDeep(attribute ? val[attribute] : val, attribute)
            )
            : val
        ),
      []
    );
  }

  getMax(data: any[], attribut: string) {
    if (!data) return 0;
    if (!attribut) return Math.max(...data);
    if (!data.length) return 0;
    let values: number[] = data.map((d) => d[attribut]).filter((d) => d);
    if (values.length === 0) return 0;
    return Math.max(...values);
    // return data.reduce((prev, current) => {
    //   return prev && Number(prev[attribut]) > Number(current[attribut]) ? prev : current
    // }
    // )[attribut];
  }

  getMaxMinByAttribute(arr: any[], attribute: string, type: 'max' | 'min') {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    if (type === 'min')
      return arr.reduce((minObj, currentObj) => {
        return currentObj[attribute] < (minObj[attribute] || Infinity)
          ? currentObj
          : minObj;
      }, {});
    else {
      return arr.reduce((maxObj, currentObj) => {
        return currentObj[attribute] > (maxObj[attribute] || -Infinity)
          ? currentObj
          : maxObj;
      }, {});
    }
  }

  removeNode(
    data: any[],
    value: string,
    keySearch: string = 'key',
    childrenPath: string = 'children'
  ): any[] {
    return data.reduce((acc: any[], node: any) => {
      // If the current node's key matches the given value, skip it
      if (node[keySearch] === value) {
        return acc;
      }
      // Filter children recursively
      const filteredChildren = node[childrenPath].length
        ? this.removeNode(node[childrenPath], value, keySearch, childrenPath)
        : [];
      // Create a new node object without the children that matched the value
      let newNode = {
        ...node /*, expanded: false*/,
      };
      newNode[childrenPath] = filteredChildren;
      // Add the new node to the accumulator
      return [...acc, newNode];
    }, []);
  }

  insertNode(
    data: any[],
    item: any,
    search: { keySearch: string; keyMap: string; childrenPath: string } = {
      keySearch: 'parent',
      keyMap: 'key',
      childrenPath: 'children',
    },
    sort: {
      path: string;
      sortBy: 'string' | 'date' | 'number';
      mode: 'asc' | 'desc';
    } = { path: 'label', sortBy: 'string', mode: 'asc' }
  ): any[] {
    // Base case: If the item's parent is null, insert it at the top level
    if (!item[search.keySearch]) {
      data = sort
        ? this.sortData([...data, item], sort.path, sort.sortBy, sort.mode)
        : [...data, item];
    } else {
      // Recursive case: Find the parent node in the data array
      const findAndInsert = (parent: any, nodes: any[]) => {
        for (let node of nodes) {
          if (
            node[search.keyMap] === parent ||
            node[search.keyMap] === parent?.[search.keyMap]
          ) {
            // Found the parent node, insert the item into its children array
            let children = node[search.childrenPath].find(
              (c: any) => c[search.keyMap] === (item[search.keyMap] || item._id)
            )
              ? node[search.childrenPath]
              : [...node[search.childrenPath], item];
            node[search.childrenPath] = sort
              ? this.sortData(children, sort.path, sort.sortBy, sort.mode)
              : children;
            return;
          } else if (node[search.childrenPath].length > 0) {
            // Recursively search for the parent node in the [search.childrenPath] of this node
            findAndInsert(parent, node[search.childrenPath]);
          }
          // return node
        }
      };
      findAndInsert(item[search.keySearch], data);
    }
    return data;
  }

  sortData(
    data: any[],
    path: string,
    sortBy: 'string' | 'date' | 'number',
    mode: 'asc' | 'desc'
  ) {
    if (mode !== 'asc' && mode !== 'desc') {
      throw new Error('Mode de tri non valide. Utilisez "asc" ou "desc".');
    }
    const comparer = (a: any, b: any) => {
      const aValue = this.getValue(a, path, sortBy);
      const bValue = this.getValue(b, path, sortBy);
      if (mode === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    };
    return data.sort(comparer);
  }

  getValue(obj: any, path: string, type: 'string' | 'date' | 'number') {
    const value = obj[path];
    switch (type) {
      case 'date':
        return new Date(value).getTime();
      case 'number':
        return Number(value);
      default:
        return String(value);
    }
  }

  removeDuplicationFromArray(data: any[], path: string) {
    let newData: any = [];
    let index = null;
    for (let d of data) {
      index = newData.findIndex((item: any) => item[path] === d[path]);
      if (index === -1) newData.push(d);
    }
    return newData;
  }

  removeDataFromArray(
    ids: any[],
    data: any[],
    sort: {
      path: string;
      type: 'number' | 'date' | 'string';
      mode: 'asc' | 'desc';
    }
  ) {
    for (let id of ids) {
      data.splice(
        data.findIndex((d: any) => d._id === id),
        1
      );
    }
    let path: any = sort.path;
    let newData = this.sortData(data, sort.path, sort.type, sort.mode);
    for (let [i, d] of newData.entries()) {
      d[path] = i + 1;
      newData[i] = { ...d };
    }
    data.splice(0, data.length, ...newData);
  }

  domSanitizerFile(file: string) {
    if (!file) return file;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(file) as string;
  }

  //#region
  dataToTreeNodes(
    data: any,
    childPath: string,
    iconepath: string | null,
    selectParent: boolean = true,
    serviceName: any = null
  ) {
    return data.map((d: any) =>
      this.dataToTreeNode(d, childPath, iconepath, selectParent, serviceName)
    );
  }
  dataToTreeNode(
    data: any,
    childPath: string,
    iconepath: string | null,
    selectParent: boolean,
    serviceName: any = null
  ) {
    if (!data.espace)
      return {
        label:
          data?.translations?.name ||
          data?.translations?.designation ||
          data?.translations?.titre ||
          data?.translations?.nom,
        data: data,
        key: data._id,
        icon: iconepath ? (serviceName ? `${API}/${serviceName}Service/${data[iconepath]}` : data[iconepath]) : '',
        parent: data.parent?._id || data.parent,
        children: this.dataToTreeNodes(
          data[childPath] || [],
          childPath,
          iconepath,
          selectParent
        ),
        selectable: !selectParent ? data[childPath]?.length : true,
      };
    else {
      return {
        label:
          data?.translations?.designation ||
          data?.translations?.titre ||
          this.translateTitle(data?.espace),
        data: data,
        key: data._id,
        icon: iconepath ? data[iconepath] : '',
        parent: data.parent?._id || data.parent,
        children: this.dataToTreeNodes(
          data[childPath] || [],
          childPath,
          iconepath,
          selectParent
        ),
        selectable:
          data.type === 'list' ||
            data.type === 'add' ||
            data.type === 'edit' ||
            data.type === 'clone' ||
            data.type === 'detail' ||
            !data.isModule
            ? true
            : false,
      };
    }
  }
  //#endregion
  formatDate(
    dateValue: any,
    type: 'date' | 'dateTime' | 'time' = 'date',
    format: string = 'dd/MM/yyyy'
  ) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!dateValue) return dateValue;
    let value: any = new Date(dateValue);
    switch (type) {
      case 'date':
        value = formatDate(value, format, this.locale, timezone);
        break;
    }
    return value;
  }

  groupDataByAttribut(data: any[], attribut: string) {
    let items: any = {};
    for (let d of data) {
      if (!items[d[attribut]]) items[d[attribut]] = [];
      items[d[attribut]].push(d);
    }
    return items;
  }

  formatNumber(value: number, format: string = '1.0-2') {
    let newValue = value;
    if (typeof newValue === 'number')
      if (newValue % 1 != 0)
        return Number(this.decimalPipe.transform(newValue, format));
      else return Number(newValue);
    else return newValue;
  }

  groupBy(data: any[], groupBy: string) {
    let items: any = {};
    if (data && !(data instanceof Array)) data = [data];
    for (let d of data) {
      if (d[groupBy]) {
        if (!items[d[groupBy]]) {
          items[d[groupBy]] = [];
        }
        items[d[groupBy]].push(d);
      }
    }
    return Object.keys(items).map(
      (g: any) => (g = { parent: g, data: items[g] })
    );
  }

}
