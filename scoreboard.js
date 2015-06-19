var Scorer = Scorer || {};
(
	function() {
		var DEFAULT_CSS_CONFIGS = {
			'DIVIDER_SIZE' : 2,
			'EDGE_SIZE' : 5
		};
		var DEFAULT_CONFIGS = {
		};


		/*************************************************************************************************
		**************************************************************************************************
		****** START OF PRIVATE FUNCTION *****
		**************************************************************************************************
		*************************************************************************************************/

		/**************************************************
		Sub-function, to add 20 numeric cards to a digit's panel
		10 for top, 10 for bottom.
		**************************************************/
		var add_score_cards = function(digitpos, top_or_bottom) {
			var str = '<div class="scorer-panel" '
				+ 'data-panel-digit="' + digitpos + '"'
				+ 'data-panel-num="0"> ';
			var panel_class = top_or_bottom == 'bottom' ? 'scorer-bottom' : 'scorer-top';
			for (var i = 9; i >= 0; i--) {
				var j = i;

				if (top_or_bottom == 'bottom') {
					j = (i - 9) * -1;
					str += '<div class="scorer-bottom-bg scorer-num ' + (j == 0 ? 'flipped' : '') + '"></div>';
				}

				str += '<div class="scorer-num ' + panel_class + ' ' + (j == 0 && top_or_bottom == 'bottom' ? 'flipped' : '') + '" '
					+ 'data-scorer-num="' + j + '">'
					+ '<span>' + j + "</span>"
					+ (top_or_bottom == 'top' ?
							'<div class="scorer-bg" style="position: absolute; left: 0; top: 0; height:100%; width:100%; background-color:black;"></div>'
							: ''
						)
					+ '</div>';
			}
			return str + '</div>';
		}

		var init_Create_Panel = function(el, numDigits) {
			var str = '';

			// Prepare top 10 digits
			for (var i = 1; i <= numDigits; i++)
				str += add_score_cards(i, 'top');

			// Add divider
			str += '<div style="clear:left;"></div>'

			// Prepare bottom 10 digits
			for (var i = 1; i <= numDigits; i++)
				str += add_score_cards(i, 'bottom');

			// Create the score cards into DOM
			el.html(str);
		}


		/**************************************************
		Sub-function, to flip a particular card, and
		recursively flip it until target number.
		**************************************************/
		var flipcard = function(direction, panel, scorer_num_el, last_num) {

			if (!scorer_num_el) return;
			var num = parseInt(scorer_num_el.attr('data-scorer-num'));


			if (scorer_num_el.hasClass('flipped')) {
				scorer_num_el.removeClass('flipped');
				if (panel == "bottom") scorer_num_el.prev('.scorer-bottom-bg').removeClass('flipped');
			}
			else {
				scorer_num_el.addClass('flipped');
				if (panel == "bottom") scorer_num_el.prev('.scorer-bottom-bg').addClass('flipped');
			}
			/*
			scorer_num_el.animate({ height: 'toggle', top: chg}, fliptime, function() {*/
			if (num == last_num) return;

			if (panel == 'top') {
				if (direction == 'up')
					setTimeout(function() {flipcard(direction, panel, scorer_num_el.prev(), last_num);}, 500);
				else setTimeout(function() {flipcard(direction, panel, scorer_num_el.next(), last_num);}, 500);
			}
			else {
				if (direction == 'up')
					setTimeout(function() {flipcard(direction, panel, scorer_num_el.next().next(), last_num);}, 500);
				else setTimeout(function() {flipcard(direction, panel, scorer_num_el.prev().prev(), last_num);}, 500);
			}
		}

		/**************************************************
		Function, to flip a particular card to target number.
		**************************************************/
		var flipdigit = function(scorer_el, digit, target_num) {
			// Get the digit to work on
			var panel = scorer_el.children('.scorer-panel[data-panel-digit="' + digit + '"]');

			// Get current digit
			var curr_num = parseInt(panel.attr('data-panel-num'));
			if (curr_num == target_num) return;

			// Set direction
			var direction = 'up';
			if (target_num < curr_num) direction = 'down';

			// Determine range of cards to flip
			var top_start_num, top_last_num, bottom_start_num, bottom_last_num;
			if (direction == 'up') {
				top_start_num = curr_num;
				top_last_num = target_num - 1;
				bottom_start_num = curr_num + 1;
				bottom_last_num = target_num;
			}
			else {
				top_start_num = curr_num - 1;
				top_last_num = target_num;
				bottom_start_num = curr_num;
				bottom_last_num = target_num + 1;
			}

			var topFlipDelay = 0, bottomFlipDelay = 0;
			if (direction == 'up') bottomFlipDelay = 250;
			else topFlipDelay = 250;

			setTimeout(function() {
				flipcard(direction, 'top', panel.children(
					'.scorer-num.scorer-top[data-scorer-num=' + top_start_num + ']'), top_last_num);
			}, topFlipDelay);
			setTimeout(function() {
				flipcard(direction, 'bottom', panel.children(
					'.scorer-num.scorer-bottom[data-scorer-num=' + bottom_start_num + ']'), bottom_last_num);
			}, bottomFlipDelay);

			// Update panel digit
			panel.attr('data-panel-num', target_num);
		}

		/*************************************************************************************************
		**************************************************************************************************
		****** START OF PUBLIC FUNCTION *****
		**************************************************************************************************
		*************************************************************************************************/

		/**************************************************
		Function, to initialize cards on the panels for
		each digit.
		**************************************************/
		this._init = function() {
			$('.scorer').each(function() {
				// Create digit cards
				var numDigits = $(this).attr('data-scorer-digits');
				init_Create_Panel($(this), numDigits);

				// Apply specified css attributes
				var scorer_css = {}, scorer_panel_css = {}, scorer_num_css = {},
					scorer_bottom_css = {}, scorer_bottom_bg_css = {};

				var cssOpt = $(this).attr('data-divider-size');
				var dividerSize = DEFAULT_CSS_CONFIGS.DIVIDER_SIZE;
				if (cssOpt) dividerSize = parseInt(cssOpt);
				scorer_panel_css['border-width'] = dividerSize;

				var cssOpt = $(this).attr('data-edge-size');
				var edgeSize = DEFAULT_CSS_CONFIGS.EDGE_SIZE;
				if (cssOpt) edgeSize = parseInt(cssOpt);
				scorer_num_css['border-width'] = edgeSize;

				var cssOpt = $(this).attr('data-divider-color');
				if (cssOpt) scorer_panel_css['border-color'] = cssOpt;

				var cssOpt = $(this).attr('data-edge-color');
				if (cssOpt) scorer_num_css['border-color'] = cssOpt;

				var cssOpt = $(this).attr('data-card-width');
				if (cssOpt) {
					scorer_num_css['width'] = cssOpt;
					scorer_panel_css['width'] = parseInt(cssOpt) + 2 * parseInt(edgeSize);
				}

				var cssOpt = $(this).attr('data-bg-color');
				if (cssOpt) scorer_num_css['background-color'] = cssOpt;

				var cssOpt = $(this).attr('data-color');
				if (cssOpt) scorer_num_css['color'] = cssOpt;

				var cssOpt = $(this).attr('data-font-size');
				if (cssOpt) scorer_num_css['font-size'] = cssOpt;

				var cssOpt = $(this).attr('data-height');
				if (cssOpt) {
					scorer_css['height'] = cssOpt;
					scorer_panel_css['height'] = parseInt(cssOpt) / 2 - (2 * dividerSize);
					var num_height = parseInt(cssOpt) - (2 * edgeSize) - (2 * dividerSize);
					scorer_num_css['height'] = num_height;
					scorer_num_css['line-height'] = num_height + 'px';
					scorer_bottom_css['top'] = -1 * parseInt(cssOpt) / 2;
					scorer_bottom_bg_css['top'] = scorer_bottom_css['top'];
				}

				$(this).css(scorer_css);
				$(this).children('.scorer-panel').css(scorer_panel_css);
				$(this).find('.scorer-num').css(scorer_num_css);
				$(this).find('.scorer-bottom').css(scorer_bottom_css);
				$(this).find('.scorer-bottom-bg').css(scorer_bottom_bg_css);
			});
		}


		this.flip = function(scorer_el, num) {
			var num_digit = parseInt(scorer_el.attr('data-scorer-digits'));
			for (var i = num_digit; i >= 1; i--) {
				flipdigit(scorer_el, i, num % 10);
				num = Math.floor(num / 10);
			}
		};
	}
).apply(Scorer);
