"""Tests for fetch-transcripts.py utility functions."""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from fetch_transcripts import parse_vtt


def test_strips_webvtt_header():
    vtt = "WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nHello world."
    result = parse_vtt(vtt)
    assert "WEBVTT" not in result
    assert "Hello world" in result


def test_strips_timestamps():
    vtt = "WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nHello world."
    result = parse_vtt(vtt)
    assert "-->" not in result


def test_strips_vtt_tags():
    vtt = "WEBVTT\n\n00:00:01.000 --> 00:00:03.000\n<00:00:01.000><c>Hello</c> world."
    result = parse_vtt(vtt)
    assert "<" not in result
    assert "Hello world" in result


def test_deduplicates_overlapping_lines():
    # YouTube auto-captions repeat the same line across consecutive cues
    vtt = (
        "WEBVTT\n\n"
        "00:00:01.000 --> 00:00:02.000\nThis is a test.\n\n"
        "00:00:01.500 --> 00:00:03.000\nThis is a test.\n\n"
        "00:00:03.000 --> 00:00:04.000\nNew sentence here."
    )
    result = parse_vtt(vtt)
    assert result.count("This is a test") == 1


def test_inserts_paragraph_breaks_at_sentence_boundaries():
    vtt = (
        "WEBVTT\n\n"
        "00:00:01.000 --> 00:00:02.000\nFirst sentence.\n\n"
        "00:00:02.000 --> 00:00:03.000\nSecond sentence."
    )
    result = parse_vtt(vtt)
    assert "\n\n" in result


def test_decodes_html_entities():
    vtt = "WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nBread &amp; butter."
    result = parse_vtt(vtt)
    assert "&amp;" not in result
    assert "Bread & butter" in result


def test_strips_kind_and_language_metadata():
    vtt = "WEBVTT\n\nKind: captions\nLanguage: en\n\n00:00:01.000 --> 00:00:03.000\nHello world."
    result = parse_vtt(vtt)
    assert "Kind:" not in result
    assert "Language:" not in result
    assert "Hello world" in result


def test_empty_vtt_returns_empty_string():
    result = parse_vtt("WEBVTT\n\n")
    assert result == ""
